(function () {
  const STORAGE_KEY = 'ucarx_mock_store_v1';
  const DEFAULT_DATA = {
    vehicle: [
      {
        objectId: 'vehicle-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          Brand: 'Toyota',
          Model: 'Corolla',
          Year: 2022,
          PlateNumber: 'ABC 1234',
          Color: 'White',
          Mileage: 32500
        }
      },
      {
        objectId: 'vehicle-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          Brand: 'Hyundai',
          Model: 'Tucson',
          Year: 2021,
          PlateNumber: 'XYZ 9876',
          Color: 'Graphite',
          Mileage: 45500
        }
      }
    ],
    maintenance: [
      {
        objectId: 'maintenance-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          VehicleId: 'vehicle-1',
          ServiceType: 'Oil Change',
          Date: new Date().toISOString(),
          Mileage: 32000,
          Cost: 950,
          Notes: 'Full synthetic oil change'
        }
      },
      {
        objectId: 'maintenance-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          VehicleId: 'vehicle-2',
          ServiceType: 'Brake Service',
          Date: new Date().toISOString(),
          Mileage: 44000,
          Cost: 1850,
          Notes: 'Front pads replaced'
        }
      }
    ],
    reminder: [
      {
        objectId: 'reminder-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          VehicleId: 'vehicle-1',
          Title: 'Insurance Renewal',
          DueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
          Type: 'Insurance Renewal',
          Status: 'pending'
        }
      }
    ],
    fuel_record: [
      {
        objectId: 'fuel-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          VehicleId: 'vehicle-1',
          Date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          Liters: 45,
          Cost: 850,
          Mileage: 31500,
          FullTank: true
        }
      },
      {
        objectId: 'fuel-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          VehicleId: 'vehicle-1',
          Date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          Liters: 42,
          Cost: 820,
          Mileage: 32350,
          FullTank: true
        }
      }
    ],
    traffic_fine: [
      {
        objectId: 'fine-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          VehicleId: 'vehicle-1',
          FineType: 'Speeding',
          Amount: 500,
          Status: 'Pending',
          Location: 'Cairo Ring Road',
          Date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
          DueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16).toISOString()
        }
      }
    ],
    marketplace_listing: [
      {
        objectId: 'listing-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          title: '2020 Nissan Sunny',
          type: 'sale',
          price: 385000,
          mileage: 41000,
          brand: 'Nissan',
          model: 'Sunny',
          year: 2020,
          color: 'Silver',
          transmission: 'automatic',
          fuelType: 'petrol',
          description: 'Single owner, dealer serviced, excellent condition.',
          phoneWhatsApp: '01234567890',
          negotiable: true
        }
      }
    ],
    notification: [
      {
        objectId: 'notification-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          Title: 'Upcoming Service',
          Message: 'Your Toyota Corolla is due for an oil change this week.',
          Read: false
        }
      }
    ],
    document: [
      {
        objectId: 'document-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          VehicleId: 'vehicle-1',
          Title: 'Insurance Policy - AXA',
          Type: 'Insurance',
          ExpiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString(),
          Notes: 'Comprehensive coverage with roadside assistance.'
        }
      },
      {
        objectId: 'document-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          VehicleId: 'vehicle-2',
          Title: 'Registration Card',
          Type: 'Registration',
          ExpiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
          Notes: ''
        }
      }
    ],
    service_center: [
      {
        objectId: 'service-center-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          name: 'AutoCare Giza',
          address: 'Ring Road, Giza',
          services: 'Oil Change, Brake Service, Diagnostics',
          rating: 4.8,
          reviewCount: 128
        }
      },
      {
        objectId: 'service-center-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          name: 'Cairo Elite Motors',
          address: '90th Street, New Cairo',
          services: 'Electrical, Transmission, AC Repair',
          rating: 4.6,
          reviewCount: 86
        }
      },
      {
        objectId: 'service-center-3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          name: 'Alexandria Quick Fix',
          address: 'Corniche Road, Alexandria',
          services: 'Tires, Suspension, Battery',
          rating: 4.4,
          reviewCount: 65
        }
      }
    ],
    user: [
      {
        objectId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        objectData: {
          Name: 'Omar Khaled',
          Phone: '+20 1234567890',
          Email: 'omar@example.com',
          NotificationsEnabled: true,
          DarkMode: false
        }
      }
    ]
  };

  function supportsLocalStorage() {
    try {
      const testKey = '__ucarx_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('LocalStorage not available, falling back to in-memory store.', error);
      return false;
    }
  }

  const hasStorage = supportsLocalStorage();
  const memoryStore = (typeof structuredClone === 'function')
    ? structuredClone(DEFAULT_DATA)
    : JSON.parse(JSON.stringify(DEFAULT_DATA));

  function getStore() {
    if (!hasStorage) {
      return memoryStore;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
      return (typeof structuredClone === 'function')
        ? structuredClone(DEFAULT_DATA)
        : JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    try {
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (error) {
      console.error('Failed to parse store, resetting to defaults.', error);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
      return (typeof structuredClone === 'function')
        ? structuredClone(DEFAULT_DATA)
        : JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  }

  function saveStore(store) {
    if (hasStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } else if (typeof window !== 'undefined' && typeof window.structuredClone === 'function') {
      Object.keys(memoryStore).forEach(key => {
        memoryStore[key] = store[key] ? window.structuredClone(store[key]) : [];
      });
    } else {
      Object.keys(memoryStore).forEach(key => {
      memoryStore[key] = store[key]
        ? JSON.parse(JSON.stringify(store[key]))
        : [];
      });
    }
  }

  function clone(item) {
    if (typeof structuredClone === 'function') {
      return structuredClone(item);
    }
    return JSON.parse(JSON.stringify(item));
  }

  async function trickleListObjects(type, limit = 50, includeMetadata = true) {
    return new Promise(resolve => {
      const store = getStore();
      const items = store[type] ? clone(store[type]) : [];
      const sliced = Number.isFinite(limit) ? items.slice(0, limit) : items;
      if (!includeMetadata) {
        const sanitized = sliced.map(({ objectId, objectData }) => ({
          objectId,
          objectData
        }));
        resolve({ items: sanitized });
      } else {
        resolve({ items: sliced });
      }
    });
  }

  async function trickleCreateObject(type, payload) {
    return new Promise((resolve, reject) => {
      if (!type) {
        reject(new Error('type is required for trickleCreateObject'));
        return;
      }
      const timestamp = new Date().toISOString();
      const store = getStore();
      if (!store[type]) {
        store[type] = [];
      }
      const fallbackId = `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`;
      const objectId = `${type}-${(typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : fallbackId}`;
      const record = {
        objectId,
        createdAt: timestamp,
        updatedAt: timestamp,
        objectData: payload
      };
      store[type].unshift(record);
      saveStore(store);
      resolve(clone(record));
    });
  }

  async function trickleUpdateObject(type, objectId, updates) {
    return new Promise((resolve, reject) => {
      if (!type || !objectId) {
        reject(new Error('type and objectId are required for trickleUpdateObject'));
        return;
      }
      const store = getStore();
      const collection = store[type] || [];
      const index = collection.findIndex(item => item.objectId === objectId);
      if (index === -1) {
        reject(new Error(`Object ${objectId} not found in ${type}`));
        return;
      }
      const record = collection[index];
      record.objectData = { ...record.objectData, ...updates };
      record.updatedAt = new Date().toISOString();
      collection[index] = record;
      store[type] = collection;
      saveStore(store);
      resolve(clone(record));
    });
  }

  async function trickleDeleteObject(type, objectId) {
    return new Promise((resolve, reject) => {
      if (!type || !objectId) {
        reject(new Error('type and objectId are required for trickleDeleteObject'));
        return;
      }
      const store = getStore();
      const collection = store[type] || [];
      store[type] = collection.filter(item => item.objectId !== objectId);
      saveStore(store);
      resolve({ success: true });
    });
  }

  async function invokeAIAgent(systemPrompt, userMessage) {
    const cannedResponses = [
      {
        keywords: ['oil', 'change'],
        response: 'For most vehicles, change your engine oil every 5,000 to 7,000 km if you are using synthetic oil. Always check the dipstick monthly and top up if the level falls below the recommended mark.'
      },
      {
        keywords: ['tire', 'rotate'],
        response: 'Rotate your tires every 10,000 km to ensure even wear. While rotating, check the tire pressure (33-35 PSI for sedans) and look for any punctures or uneven tread.'
      },
      {
        keywords: ['brake'],
        response: 'Watch out for squealing noises, a spongy pedal, or longer stopping distance—these are all signs your brakes need inspection. Don’t ignore brake warning lights; book a service immediately.'
      },
      {
        keywords: ['battery'],
        response: 'Car batteries usually last 2-3 years in Egyptian weather. Clean the terminals twice per year and have the voltage checked if you experience slow starts.'
      }
    ];

    const normalized = userMessage.toLowerCase();
    const matched = cannedResponses.find(entry =>
      entry.keywords.every(keyword => normalized.includes(keyword))
    );

    const genericFallback = 'Keep an eye on your maintenance schedule, fluids, and tires. If you spot any warning lights or unusual sounds, schedule a diagnostic check with a trusted service center.';

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(matched ? matched.response : genericFallback);
      }, 600);
    });
  }

  function trickleResetStore() {
      const resetValue = (typeof structuredClone === 'function')
        ? structuredClone(DEFAULT_DATA)
        : JSON.parse(JSON.stringify(DEFAULT_DATA));
      saveStore(resetValue);
  }

  window.trickleListObjects = trickleListObjects;
  window.trickleCreateObject = trickleCreateObject;
  window.trickleUpdateObject = trickleUpdateObject;
  window.trickleDeleteObject = trickleDeleteObject;
  window.invokeAIAgent = invokeAIAgent;
  window.trickleResetStore = trickleResetStore;
})();
