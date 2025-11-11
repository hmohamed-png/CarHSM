require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const {
  createCollectionConfig,
  buildResponseItem,
  mapObjectDataToDb,
  cleanDataForWrite,
  generateObjectId
} = require('./collections');

const PORT = process.env.PORT || 4000;
const ROOT_DIR = path.join(__dirname, '..');
const CLIENT_DIST_DIR = path.join(__dirname, '..', 'client', 'dist');
const STATIC_ROOT = fs.existsSync(CLIENT_DIST_DIR) ? CLIENT_DIST_DIR : ROOT_DIR;
const SEED_FILE = path.join(__dirname, 'seed.json');

const prisma = new PrismaClient();
const collectionConfig = createCollectionConfig(prisma);

const app = express();
app.use(cors());
app.use(express.json());

function resolveField(payload, field) {
  if (payload[field] !== undefined) return payload[field];
  const camel = field.charAt(0).toLowerCase() + field.slice(1);
  return payload[camel];
}

app.get('/api/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    const config = collectionConfig[collection];
    if (!config) {
      return res.status(404).json({ message: 'Unknown collection' });
    }
    const limit = Number.parseInt(req.query.limit, 10);
    const includeMetadata = req.query.meta !== 'false';
    const query = {};
    if (Number.isFinite(limit)) {
      query.take = limit;
    }
    if (config.orderBy) {
      query.orderBy = config.orderBy;
    }
    const records = await config.model.findMany(query);
    const items = records.map((record) => buildResponseItem(config, record, includeMetadata));
    return res.json({ items });
  } catch (error) {
    console.error('GET collection error', error);
    res.status(500).send('Unable to load data');
  }
});

app.post('/api/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    const config = collectionConfig[collection];
    if (!config) {
      return res.status(404).json({ message: 'Unknown collection' });
    }
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ message: 'Request body must be an object' });
    }

    if (config.requiredFields.length) {
      const missing = config.requiredFields.filter((field) => {
        const value = resolveField(payload, field);
        return value === undefined || value === null || value === '';
      });
      if (missing.length) {
        return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
      }
    }

    let data;
    try {
      data = cleanDataForWrite(mapObjectDataToDb(collection, payload));
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    const record = await config.model.create({
      data: {
        id: generateObjectId(config.idPrefix),
        ...data
      }
    });
    res.status(201).json(buildResponseItem(config, record));
  } catch (error) {
    console.error('POST collection error', error);
    res.status(500).send('Unable to create record');
  }
});

app.patch('/api/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;
    const config = collectionConfig[collection];
    if (!config) {
      return res.status(404).json({ message: 'Unknown collection' });
    }
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ message: 'Updates must be an object' });
    }

    let data;
    try {
      data = cleanDataForWrite(mapObjectDataToDb(collection, updates));
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    try {
      const record = await config.model.update({
        where: { id },
        data
      });
      res.json(buildResponseItem(config, record));
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Record not found' });
      }
      throw error;
    }
  } catch (error) {
    console.error('PATCH collection error', error);
    res.status(500).send('Unable to update record');
  }
});

app.delete('/api/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;
    const config = collectionConfig[collection];
    if (!config) {
      return res.status(404).json({ message: 'Unknown collection' });
    }
    try {
      await config.model.delete({ where: { id } });
      res.status(204).end();
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Record not found' });
      }
      throw error;
    }
  } catch (error) {
    console.error('DELETE collection error', error);
    res.status(500).send('Unable to delete record');
  }
});

app.post('/api/reset', async (_req, res) => {
  try {
    const raw = fs.readFileSync(SEED_FILE, 'utf-8');
    const seed = JSON.parse(raw);

    const deleteOrder = [
      'maintenance',
      'fuel_record',
      'reminder',
      'traffic_fine',
      'document',
      'notification',
      'marketplace_listing',
      'service_center',
      'vehicle',
      'user'
    ];

    for (const collection of deleteOrder) {
      if (collectionConfig[collection]) {
        await collectionConfig[collection].model.deleteMany();
      }
    }

    const createOrder = [
      'user',
      'vehicle',
      'maintenance',
      'fuel_record',
      'reminder',
      'traffic_fine',
      'marketplace_listing',
      'notification',
      'document',
      'service_center'
    ];

    for (const collection of createOrder) {
      const records = seed[collection];
      const config = collectionConfig[collection];
      if (!records || !config) continue;

      for (const record of records) {
        const data = cleanDataForWrite(mapObjectDataToDb(collection, record.objectData));
        const payload = {
          id: record.objectId,
          ...data
        };
        if (record.createdAt) {
          payload.createdAt = new Date(record.createdAt);
        }
        await config.model.create({ data: payload });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('RESET error', error);
    res.status(500).send('Unable to reset data');
  }
});

app.post('/api/ai', async (req, res) => {
  try {
    const { userMessage = '' } = req.body || {};
    const lower = String(userMessage).toLowerCase();

    const cannedResponses = [
      {
        keywords: ['oil', 'change'],
        message:
          'For most vehicles, change the engine oil every 5,000–7,000 km when using synthetic oil. Check the level monthly and top up if it drops below the dipstick marker.'
      },
      {
        keywords: ['tire', 'rotate'],
        message:
          'Rotate tires every 10,000 km to ensure even wear. While rotating, check pressures (33–35 PSI for most sedans) and inspect tread depth.'
      },
      {
        keywords: ['brake'],
        message:
          'Squealing noises, vibration, or longer stopping distances are warning signs for your brakes. Schedule an inspection immediately if any appear.'
      },
      {
        keywords: ['battery'],
        message:
          'Car batteries last roughly 2–3 years in Egyptian heat. Clean terminals twice a year and have the voltage checked if you notice slow starts.'
      }
    ];

    const matched = cannedResponses.find(entry =>
      entry.keywords.every(keyword => lower.includes(keyword))
    );

    const fallback =
      'Keep up with scheduled maintenance, monitor warning lights, and don’t delay inspections if you notice unusual noises or performance changes.';

    res.json({ message: matched ? matched.message : fallback });
  } catch (error) {
    console.error('AI endpoint error', error);
    res.status(500).send('Unable to contact assistant');
  }
});

app.use(express.static(STATIC_ROOT));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  const requestedPath = path.join(STATIC_ROOT, req.path);
  fs.stat(requestedPath, (err, stats) => {
    if (!err && stats.isFile()) {
      return res.sendFile(requestedPath);
    }
    const fallback = fs.existsSync(path.join(STATIC_ROOT, 'index.html'))
      ? path.join(STATIC_ROOT, 'index.html')
      : path.join(ROOT_DIR, 'index.html');
    res.sendFile(fallback);
  });
});

app.listen(PORT, () => {
  console.log(`🚗 UCarX API listening on http://localhost:${PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
