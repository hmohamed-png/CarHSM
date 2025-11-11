const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const ROOT_DIR = path.join(__dirname, '..');
const DATA_FILE = path.join(__dirname, 'data.json');
const SEED_FILE = path.join(__dirname, 'seed.json');

const app = express();
app.use(cors());
app.use(express.json());

async function readJsonFile(filePath) {
  const data = await fsp.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function writeJsonFile(filePath, data) {
  await fsp.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function ensureDataFile() {
  try {
    await fsp.access(DATA_FILE);
  } catch (error) {
    const seed = await readJsonFile(SEED_FILE);
    await writeJsonFile(DATA_FILE, seed);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

async function loadData() {
  await ensureDataFile();
  return readJsonFile(DATA_FILE);
}

async function saveData(data) {
  await writeJsonFile(DATA_FILE, data);
}

function createId(prefix) {
  const random =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 10)}`;
  return `${prefix}-${random}`;
}

app.get('/api/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    const limit = Number.parseInt(req.query.limit, 10);
    const includeMetadata = req.query.meta !== 'false';
    const data = await loadData();
    const items = clone(data[collection] || []);
    const sliced = Number.isFinite(limit) ? items.slice(0, limit) : items;

    if (includeMetadata) {
      return res.json({ items: sliced });
    }

    const sanitized = sliced.map(({ objectId, objectData }) => ({
      objectId,
      objectData
    }));
    return res.json({ items: sanitized });
  } catch (error) {
    console.error('GET collection error', error);
    res.status(500).send('Unable to load data');
  }
});

app.post('/api/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ message: 'Request body must be an object' });
    }

    const timestamp = new Date().toISOString();
    const data = await loadData();
    if (!Array.isArray(data[collection])) {
      data[collection] = [];
    }

    const record = {
      objectId: createId(collection),
      createdAt: timestamp,
      updatedAt: timestamp,
      objectData: payload
    };
    data[collection].unshift(record);
    await saveData(data);
    res.status(201).json(record);
  } catch (error) {
    console.error('POST collection error', error);
    res.status(500).send('Unable to create record');
  }
});

app.patch('/api/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ message: 'Updates must be an object' });
    }

    const data = await loadData();
    if (!Array.isArray(data[collection])) {
      data[collection] = [];
    }
    const index = data[collection].findIndex(item => item.objectId === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const record = data[collection][index];
    record.objectData = { ...record.objectData, ...updates };
    record.updatedAt = new Date().toISOString();
    data[collection][index] = record;

    await saveData(data);
    res.json(record);
  } catch (error) {
    console.error('PATCH collection error', error);
    res.status(500).send('Unable to update record');
  }
});

app.delete('/api/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;
    const data = await loadData();
    if (!Array.isArray(data[collection])) {
      data[collection] = [];
    }
    const originalLength = data[collection].length;
    data[collection] = data[collection].filter(item => item.objectId !== id);
    if (data[collection].length === originalLength) {
      return res.status(404).json({ message: 'Record not found' });
    }

    await saveData(data);
    res.status(204).end();
  } catch (error) {
    console.error('DELETE collection error', error);
    res.status(500).send('Unable to delete record');
  }
});

app.post('/api/reset', async (_req, res) => {
  try {
    const seed = await readJsonFile(SEED_FILE);
    await saveData(seed);
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

app.use(express.static(ROOT_DIR));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  const requestedPath = path.join(ROOT_DIR, req.path);
  fs.stat(requestedPath, (err, stats) => {
    if (!err && stats.isFile()) {
      return res.sendFile(requestedPath);
    }
    res.sendFile(path.join(ROOT_DIR, 'index.html'));
  });
});

app.listen(PORT, () => {
  console.log(`🚗 UCarX API listening on http://localhost:${PORT}`);
});
