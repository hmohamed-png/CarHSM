const crypto = require('crypto');

const transformers = {
  vehicle: {
    modelName: 'vehicle',
    idPrefix: 'vehicle',
    orderBy: { createdAt: 'desc' },
    requiredFields: ['Brand', 'Model', 'Year', 'PlateNumber', 'Color', 'Mileage'],
    from: (input) => ({
      brand: coerceString(input.Brand),
      model: coerceString(input.Model),
      year: coerceInt(input.Year),
      plateNumber: coerceString(input.PlateNumber),
      color: coerceString(input.Color),
      mileage: coerceIntOptional(input.Mileage)
    }),
    to: (record) => ({
      Brand: record.brand,
      Model: record.model,
      Year: record.year,
      PlateNumber: record.plateNumber,
      Color: record.color,
      Mileage: record.mileage
    })
  },
  maintenance: {
    modelName: 'maintenance',
    idPrefix: 'maintenance',
    orderBy: { date: 'desc' },
    requiredFields: ['VehicleId', 'ServiceType', 'Date', 'Mileage', 'Cost'],
    from: (input) => ({
      vehicleId: coerceString(input.VehicleId),
      serviceType: coerceString(input.ServiceType),
      date: coerceDate(input.Date),
      mileage: coerceIntOptional(input.Mileage),
      cost: coerceFloatOptional(input.Cost),
      notes: coerceStringOptional(input.Notes),
      nextServiceMileage: coerceIntOptional(input.NextServiceMileage),
      invoiceAmount: coerceFloatOptional(input.InvoiceAmount ?? input.invoiceAmount),
      paymentStatus: coercePaymentStatusOptional(input.PaymentStatus ?? input.paymentStatus),
      paymentId: coerceStringOptional(input.PaymentId ?? input.paymentId)
    }),
    to: (record) => ({
      VehicleId: record.vehicleId,
      ServiceType: record.serviceType,
      Date: record.date.toISOString(),
      Mileage: record.mileage,
      Cost: record.cost,
      Notes: record.notes,
      NextServiceMileage: record.nextServiceMileage,
      InvoiceAmount: record.invoiceAmount,
      PaymentStatus: record.paymentStatus,
      PaymentId: record.paymentId
    })
  },
  reminder: {
    modelName: 'reminder',
    idPrefix: 'reminder',
    orderBy: { dueDate: 'asc' },
    requiredFields: ['VehicleId', 'Title', 'DueDate', 'Type', 'Status'],
    from: (input) => ({
      vehicleId: coerceString(input.VehicleId),
      title: coerceString(input.Title),
      dueDate: coerceDate(input.DueDate),
      type: coerceString(input.Type),
      status: coerceString(input.Status)
    }),
    to: (record) => ({
      VehicleId: record.vehicleId,
      Title: record.title,
      DueDate: record.dueDate.toISOString(),
      Type: record.type,
      Status: record.status
    })
  },
  fuel_record: {
    modelName: 'fuelRecord',
    idPrefix: 'fuel',
    orderBy: { date: 'desc' },
    requiredFields: ['VehicleId', 'Date', 'Liters', 'Cost', 'Mileage'],
    from: (input) => ({
      vehicleId: coerceString(input.VehicleId),
      date: coerceDate(input.Date),
      liters: coerceFloat(input.Liters),
      cost: coerceFloat(input.Cost),
      mileage: coerceInt(input.Mileage),
      fullTank: coerceBooleanOptional(input.FullTank)
    }),
    to: (record) => ({
      VehicleId: record.vehicleId,
      Date: record.date.toISOString(),
      Liters: record.liters,
      Cost: record.cost,
      Mileage: record.mileage,
      FullTank: record.fullTank
    })
  },
  traffic_fine: {
    modelName: 'trafficFine',
    idPrefix: 'fine',
    orderBy: { date: 'desc' },
    requiredFields: ['VehicleId', 'FineType', 'Amount', 'Status', 'Location', 'Date', 'DueDate'],
    from: (input) => ({
      vehicleId: coerceString(input.VehicleId),
      fineType: coerceString(input.FineType),
      amount: coerceFloat(input.Amount),
      status: coerceString(input.Status),
      location: coerceString(input.Location),
      date: coerceDate(input.Date),
      dueDate: coerceDate(input.DueDate),
      paymentReference: coerceStringOptional(input.PaymentReference),
      paymentStatus: coercePaymentStatusOptional(input.PaymentStatus ?? input.paymentStatus),
      paymentId: coerceStringOptional(input.PaymentId ?? input.paymentId)
    }),
    to: (record) => ({
      VehicleId: record.vehicleId,
      FineType: record.fineType,
      Amount: record.amount,
      Status: record.status,
      Location: record.location,
      Date: record.date.toISOString(),
      DueDate: record.dueDate.toISOString(),
      PaymentReference: record.paymentReference,
      PaymentStatus: record.paymentStatus,
      PaymentId: record.paymentId
    })
  },
  marketplace_listing: {
    modelName: 'marketplaceListing',
    idPrefix: 'listing',
    orderBy: { createdAt: 'desc' },
    requiredFields: [
      'title',
      'type',
      'price',
      'mileage',
      'brand',
      'model',
      'year',
      'color',
      'transmission',
      'fuelType',
      'phoneWhatsApp'
    ],
    from: (input) => ({
      title: coerceString(input.title || input.Title),
      type: coerceString(input.type || input.Type),
      price: coerceFloat(input.price ?? input.Price),
      mileage: coerceInt(input.mileage ?? input.Mileage),
      brand: coerceString(input.brand ?? input.Brand),
      model: coerceString(input.model ?? input.Model),
      year: coerceInt(input.year ?? input.Year),
      color: coerceString(input.color ?? input.Color),
      transmission: coerceString(input.transmission ?? input.Transmission),
      fuelType: coerceString(input.fuelType ?? input.FuelType),
      description: coerceStringOptional(input.description ?? input.Description),
      phoneWhatsApp: coerceString(input.phoneWhatsApp ?? input.PhoneWhatsApp),
      negotiable: coerceBooleanOptional(input.negotiable ?? input.Negotiable)
    }),
    to: (record) => ({
      title: record.title,
      type: record.type,
      price: record.price,
      mileage: record.mileage,
      brand: record.brand,
      model: record.model,
      year: record.year,
      color: record.color,
      transmission: record.transmission,
      fuelType: record.fuelType,
      description: record.description,
      phoneWhatsApp: record.phoneWhatsApp,
      negotiable: record.negotiable
    })
  },
  notification: {
    modelName: 'notification',
    idPrefix: 'notification',
    orderBy: { createdAt: 'desc' },
    requiredFields: ['Title', 'Message'],
    from: (input) => ({
      title: coerceString(input.Title),
      message: coerceString(input.Message),
      read: coerceBooleanOptional(input.Read)
    }),
    to: (record) => ({
      Title: record.title,
      Message: record.message,
      Read: record.read
    })
  },
  document: {
    modelName: 'document',
    idPrefix: 'document',
    orderBy: { createdAt: 'desc' },
    requiredFields: ['VehicleId', 'Title', 'Type'],
    from: (input) => ({
      vehicleId: coerceString(input.VehicleId),
      title: coerceString(input.Title),
      type: coerceString(input.Type),
      expiryDate: coerceDateOptional(input.ExpiryDate),
      notes: coerceStringOptional(input.Notes)
    }),
    to: (record) => ({
      VehicleId: record.vehicleId,
      Title: record.title,
      Type: record.type,
      ExpiryDate: record.expiryDate ? record.expiryDate.toISOString() : null,
      Notes: record.notes
    })
  },
  service_center: {
    modelName: 'serviceCenter',
    idPrefix: 'service-center',
    orderBy: { name: 'asc' },
    requiredFields: ['name', 'address', 'services', 'rating', 'reviewCount'],
    from: (input) => ({
      name: coerceString(input.name ?? input.Name),
      address: coerceString(input.address ?? input.Address),
      services: coerceString(input.services ?? input.Services),
      rating: coerceFloat(input.rating ?? input.Rating),
      reviewCount: coerceInt(input.reviewCount ?? input.ReviewCount)
    }),
    to: (record) => ({
      name: record.name,
      address: record.address,
      services: record.services,
      rating: record.rating,
      reviewCount: record.reviewCount
    })
  },
  user: {
    modelName: 'user',
    idPrefix: 'user',
    orderBy: { createdAt: 'desc' },
    requiredFields: ['Name', 'Phone'],
    from: (input) => ({
      name: coerceString(input.Name),
      phone: coerceString(input.Phone),
      email: coerceStringOptional(input.Email),
      notificationsEnabled: coerceBooleanOptional(input.NotificationsEnabled),
      darkMode: coerceBooleanOptional(input.DarkMode),
      role: coerceUserRoleOptional(input.Role ?? input.role)
    }),
    to: (record) => ({
      Name: record.name,
      Phone: record.phone,
      Email: record.email,
      NotificationsEnabled: record.notificationsEnabled,
      DarkMode: record.darkMode,
      Role: record.role
    })
  },
  payment: {
    modelName: 'payment',
    idPrefix: 'payment',
    orderBy: { createdAt: 'desc' },
    requiredFields: ['UserId', 'Amount', 'TargetType'],
    from: (input) => ({
      userId: coerceString(input.UserId),
      amount: coerceDecimal(input.Amount),
      currency: coerceStringOptional(input.Currency) ?? 'EGP',
      targetType: coercePaymentTargetType(input.TargetType ?? input.targetType),
      targetId: coerceStringOptional(input.TargetId ?? input.targetId),
      status: coercePaymentStatusOptional(input.Status ?? input.status),
      provider: coercePaymentProviderOptional(input.Provider ?? input.provider),
      reference: coerceStringOptional(input.Reference ?? input.reference),
      expiresAt: coerceDateOptional(input.ExpiresAt ?? input.expiresAt),
      payload: input.Payload ?? input.payload ?? null
    }),
    to: (record) => ({
      UserId: record.userId,
      Amount: record.amount,
      Currency: record.currency,
      TargetType: record.targetType,
      TargetId: record.targetId,
      Status: record.status,
      Provider: record.provider,
      Reference: record.reference,
      ExpiresAt: record.expiresAt ? record.expiresAt.toISOString() : null,
      Payload: record.payload
    })
  }
};

function createCollectionConfig(prisma) {
  const config = {};
  Object.entries(transformers).forEach(([collection, transformer]) => {
    const model = prisma[transformer.modelName];
    if (!model) {
      throw new Error(`Prisma model ${transformer.modelName} not found`);
    }
    config[collection] = {
      model,
      idPrefix: transformer.idPrefix,
      orderBy: transformer.orderBy || { createdAt: 'desc' },
      requiredFields: transformer.requiredFields || [],
      fromObjectData: transformer.from,
      toObjectData: transformer.to
    };
  });
  return config;
}

function buildResponseItem(config, record, includeMetadata = true) {
  const base = {
    objectId: record.id,
    objectData: config.toObjectData(record)
  };
  if (includeMetadata) {
    base.createdAt = record.createdAt.toISOString();
    base.updatedAt = record.updatedAt.toISOString();
  }
  return base;
}

function mapObjectDataToDb(collection, objectData) {
  const transformer = transformers[collection];
  if (!transformer) {
    throw new Error(`Unsupported collection: ${collection}`);
  }
  return transformer.from(objectData || {});
}

function cleanDataForWrite(data) {
  return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));
}

function generateObjectId(prefix) {
  const base = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 10)}`;
  return `${prefix}-${base}`;
}

function coerceString(value) {
  if (value === undefined || value === null) return undefined;
  return String(value).trim();
}

function coerceStringOptional(value) {
  const result = coerceString(value);
  return result === undefined || result === '' ? undefined : result;
}

function coerceInt(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid integer value: ${value}`);
  }
  return parsed;
}

function coerceIntOptional(value) {
  const parsed = coerceInt(value);
  return parsed === undefined ? undefined : parsed;
}

function coerceFloat(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number value: ${value}`);
  }
  return parsed;
}

function coerceFloatOptional(value) {
  const parsed = coerceFloat(value);
  return parsed === undefined ? undefined : parsed;
}

function coerceDecimal(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    throw new Error(`Invalid decimal value: ${value}`);
  }
  return numeric;
}

function coerceUserRoleOptional(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const normalized = String(value).toUpperCase();
  if (!['OWNER', 'VIEWER'].includes(normalized)) {
    throw new Error(`Invalid user role: ${value}`);
  }
  return normalized;
}

function coercePaymentStatusOptional(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const normalized = String(value).toUpperCase();
  if (!['PENDING', 'PAID', 'CANCELLED', 'EXPIRED', 'NOT_REQUIRED'].includes(normalized)) {
    throw new Error(`Invalid payment status: ${value}`);
  }
  return normalized;
}

function coercePaymentProviderOptional(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const normalized = String(value).toUpperCase();
  if (!['MOCK', 'FAWRY'].includes(normalized)) {
    throw new Error(`Invalid payment provider: ${value}`);
  }
  return normalized;
}

function coercePaymentTargetType(value) {
  if (!value && value !== 0) {
    throw new Error('Payment target type is required');
  }
  const normalized = String(value).toUpperCase();
  if (!['TRAFFIC_FINE', 'MAINTENANCE'].includes(normalized)) {
    throw new Error(`Invalid payment target type: ${value}`);
  }
  return normalized;
}

function coerceBooleanOptional(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return Boolean(value);
}

function coerceDate(value) {
  if (value === undefined || value === '') return undefined;
  if (value === null) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }
  return date;
}

function coerceDateOptional(value) {
  return coerceDate(value);
}

module.exports = {
  createCollectionConfig,
  buildResponseItem,
  mapObjectDataToDb,
  cleanDataForWrite,
  generateObjectId
};
