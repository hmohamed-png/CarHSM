/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { createCollectionConfig, mapObjectDataToDb, cleanDataForWrite } = require('../server/collections');

const prisma = new PrismaClient();

const seedPath = path.join(__dirname, '..', 'server', 'seed.json');

async function main() {
  const raw = fs.readFileSync(seedPath, 'utf-8');
  const seed = JSON.parse(raw);

  const collections = createCollectionConfig(prisma);

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
    if (collections[collection]) {
      await collections[collection].model.deleteMany();
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
    const config = collections[collection];
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
}

main()
  .catch((error) => {
    console.error('Seeding error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
