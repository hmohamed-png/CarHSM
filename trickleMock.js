// Trickle Mock - Emulates Trickle backend operations using localStorage
// This allows the application to run entirely in the browser without external dependencies

class TrickleMock {
    constructor() {
        this.storage = window.localStorage;
        this.tables = {};
        this.initializeTables();
    }

    initializeTables() {
        // Define table schemas
        this.tableSchemas = {
            vehicle: {
                fields: [
                    { name: 'Brand', type: 'text', required: true },
                    { name: 'Model', type: 'text', required: true },
                    { name: 'Year', type: 'number', required: true },
                    { name: 'PlateNumber', type: 'text', required: true },
                    { name: 'Color', type: 'text', required: true },
                    { name: 'Mileage', type: 'number', required: true },
                    { name: 'VIN', type: 'text', required: false },
                    { name: 'PurchaseDate', type: 'date', required: false },
                    { name: 'InsuranceExpiry', type: 'date', required: false },
                    { name: 'LicenseExpiry', type: 'date', required: false }
                ]
            },
            maintenance: {
                fields: [
                    { name: 'VehicleId', type: 'text', required: true },
                    { name: 'Type', type: 'text', required: true },
                    { name: 'Date', type: 'date', required: true },
                    { name: 'Mileage', type: 'number', required: true },
                    { name: 'Cost', type: 'number', required: true },
                    { name: 'Description', type: 'text', required: false },
                    { name: 'ServiceCenter', type: 'text', required: false },
                    { name: 'NextServiceDate', type: 'date', required: false }
                ]
            },
            reminder: {
                fields: [
                    { name: 'VehicleId', type: 'text', required: true },
                    { name: 'Type', type: 'text', required: true },
                    { name: 'Title', type: 'text', required: true },
                    { name: 'DueDate', type: 'date', required: true },
                    { name: 'Mileage', type: 'number', required: false },
                    { name: 'Description', type: 'text', required: false },
                    { name: 'Status', type: 'text', required: true }
                ]
            },
            fuel_log: {
                fields: [
                    { name: 'VehicleId', type: 'text', required: true },
                    { name: 'Date', type: 'date', required: true },
                    { name: 'Mileage', type: 'number', required: true },
                    { name: 'Liters', type: 'number', required: true },
                    { name: 'Cost', type: 'number', required: true },
                    { name: 'PricePerLiter', type: 'number', required: true },
                    { name: 'Station', type: 'text', required: false }
                ]
            },
            marketplace_listing: {
                fields: [
                    { name: 'Title', type: 'text', required: true },
                    { name: 'Brand', type: 'text', required: true },
                    { name: 'Model', type: 'text', required: true },
                    { name: 'Year', type: 'number', required: true },
                    { name: 'Price', type: 'number', required: true },
                    { name: 'Mileage', type: 'number', required: true },
                    { name: 'Description', type: 'text', required: false },
                    { name: 'Images', type: 'text', required: false },
                    { name: 'ContactInfo', type: 'text', required: true },
                    { name: 'Status', type: 'text', required: true }
                ]
            },
            document: {
                fields: [
                    { name: 'VehicleId', type: 'text', required: true },
                    { name: 'Type', type: 'text', required: true },
                    { name: 'Title', type: 'text', required: true },
                    { name: 'FileName', type: 'text', required: true },
                    { name: 'UploadDate', type: 'date', required: true },
                    { name: 'ExpiryDate', type: 'date', required: false },
                    { name: 'Description', type: 'text', required: false }
                ]
            },
            traffic_fine: {
                fields: [
                    { name: 'VehicleId', type: 'text', required: true },
                    { name: 'Date', type: 'date', required: true },
                    { name: 'Amount', type: 'number', required: true },
                    { name: 'Reason', type: 'text', required: true },
                    { name: 'Location', type: 'text', required: false },
                    { name: 'Status', type: 'text', required: true },
                    { name: 'PaymentDate', type: 'date', required: false }
                ]
            },
            notification: {
                fields: [
                    { name: 'UserId', type: 'text', required: true },
                    { name: 'Type', type: 'text', required: true },
                    { name: 'Title', type: 'text', required: true },
                    { name: 'Message', type: 'text', required: true },
                    { name: 'Date', type: 'date', required: true },
                    { name: 'Read', type: 'boolean', required: true },
                    { name: 'RelatedId', type: 'text', required: false }
                ]
            }
        };

        // Load existing data from localStorage
        Object.keys(this.tableSchemas).forEach(tableName => {
            const stored = this.storage.getItem(`trickle_${tableName}`);
            this.tables[tableName] = stored ? JSON.parse(stored) : [];
        });
    }

    // Save table data to localStorage
    saveTable(tableName) {
        this.storage.setItem(`trickle_${tableName}`, JSON.stringify(this.tables[tableName]));
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Validate object against schema
    validateObject(tableName, obj) {
        const schema = this.tableSchemas[tableName];
        if (!schema) throw new Error(`Table ${tableName} does not exist`);

        for (const field of schema.fields) {
            if (field.required && (obj[field.name] === undefined || obj[field.name] === null || obj[field.name] === '')) {
                throw new Error(`Required field ${field.name} is missing`);
            }
        }
        return true;
    }

    // Create object
    async createObject(tableName, obj) {
        this.validateObject(tableName, obj);

        const newObj = {
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...obj
        };

        if (!this.tables[tableName]) this.tables[tableName] = [];
        this.tables[tableName].push(newObj);
        this.saveTable(tableName);

        return newObj;
    }

    // List objects
    async listObjects(tableName, filter = {}) {
        if (!this.tables[tableName]) return [];

        let results = [...this.tables[tableName]];

        // Apply filters
        Object.keys(filter).forEach(key => {
            if (filter[key] !== undefined && filter[key] !== null) {
                results = results.filter(item => item[key] === filter[key]);
            }
        });

        return results;
    }

    // Get object by ID
    async getObject(tableName, id) {
        if (!this.tables[tableName]) return null;
        return this.tables[tableName].find(item => item.id === id) || null;
    }

    // Update object
    async updateObject(tableName, id, updates) {
        if (!this.tables[tableName]) throw new Error(`Table ${tableName} does not exist`);

        const index = this.tables[tableName].findIndex(item => item.id === id);
        if (index === -1) throw new Error(`Object with id ${id} not found`);

        const updatedObj = {
            ...this.tables[tableName][index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.validateObject(tableName, updatedObj);
        this.tables[tableName][index] = updatedObj;
        this.saveTable(tableName);

        return updatedObj;
    }

    // Delete object
    async deleteObject(tableName, id) {
        if (!this.tables[tableName]) throw new Error(`Table ${tableName} does not exist`);

        const index = this.tables[tableName].findIndex(item => item.id === id);
        if (index === -1) throw new Error(`Object with id ${id} not found`);

        this.tables[tableName].splice(index, 1);
        this.saveTable(tableName);

        return true;
    }

    // Get all data (for debugging)
    getAllData() {
        return this.tables;
    }

    // Clear all data
    clearAllData() {
        Object.keys(this.tableSchemas).forEach(tableName => {
            this.tables[tableName] = [];
            this.storage.removeItem(`trickle_${tableName}`);
        });
    }
}

// Global instance
window.trickleMock = new TrickleMock();

// Expose functions globally to match original Trickle API
window.trickleCreateObject = async (tableName, obj) => {
    return await window.trickleMock.createObject(tableName, obj);
};

window.trickleListObjects = async (tableName, filter = {}) => {
    return await window.trickleMock.listObjects(tableName, filter);
};

window.trickleGetObject = async (tableName, id) => {
    return await window.trickleMock.getObject(tableName, id);
};

window.trickleUpdateObject = async (tableName, id, updates) => {
    return await window.trickleMock.updateObject(tableName, id, updates);
};

window.trickleDeleteObject = async (tableName, id) => {
    return await window.trickleMock.deleteObject(tableName, id);
};

// Initialize with sample data
(async () => {
    try {
        // Add sample vehicle if none exist
        const vehicles = await trickleListObjects('vehicle');
        if (vehicles.length === 0) {
            await trickleCreateObject('vehicle', {
                Brand: 'Toyota',
                Model: 'Corolla',
                Year: 2020,
                PlateNumber: 'ABC-123',
                Color: 'White',
                Mileage: 15000,
                VIN: '1HGCM82633A123456',
                PurchaseDate: '2020-01-15',
                InsuranceExpiry: '2025-01-15',
                LicenseExpiry: '2025-06-30'
            });
        }

        // Add sample maintenance
        const maintenance = await trickleListObjects('maintenance');
        if (maintenance.length === 0) {
            const vehicles = await trickleListObjects('vehicle');
            if (vehicles.length > 0) {
                await trickleCreateObject('maintenance', {
                    VehicleId: vehicles[0].id,
                    Type: 'Oil Change',
                    Date: '2024-01-15',
                    Mileage: 15000,
                    Cost: 500,
                    Description: 'Regular oil change and filter replacement',
                    ServiceCenter: 'Toyota Service Center',
                    NextServiceDate: '2024-07-15'
                });
            }
        }

        console.log('TrickleMock initialized with sample data');
    } catch (error) {
        console.error('Error initializing TrickleMock:', error);
    }
})();