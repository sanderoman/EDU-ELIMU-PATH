/**
 * Centralized Key Database for Real-Time Validation
 * In production, replace with MongoDB/PostgreSQL/Redis
 */

export interface KeyRecord {
  id: string;
  code: string;
  label: string;
  createdAt: string;
  activatedAt?: string;
  expiresAt?: string;
  status: 'active' | 'inactive' | 'expired';
  createdBy: string;
  lastValidatedAt?: string;
  usageCount: number;
  linkedPhones: string[]; // Phones that have used this key
}

// Centralized in-memory database (replace with real DB in production)
let keyDatabase: KeyRecord[] = [
  // Pre-loaded admin keys for testing - using fixed timestamps to avoid restart issues
  {
    id: 'admin-001',
    code: 'MASTER001',
    label: 'Admin Master Key',
    createdAt: '2024-01-01T00:00:00.000Z', // Fixed timestamp
    activatedAt: '2024-01-01T00:00:00.000Z', // Fixed timestamp
    status: 'active',
    createdBy: 'system',
    usageCount: 0,
    linkedPhones: []
  },
  {
    id: 'demo-001',
    code: 'DEMO123',
    label: 'Demo Access Key',
    createdAt: '2024-01-01T00:00:00.000Z', // Fixed timestamp
    activatedAt: '2024-01-01T00:00:00.000Z', // Fixed timestamp
    status: 'active',
    createdBy: 'system',
    usageCount: 0,
    linkedPhones: []
  }
];

// Database operations
export const keyDB = {
  // Get all keys
  getAllKeys: (): KeyRecord[] => {
    console.log(`[DB] getAllKeys: returning ${keyDatabase.length} keys`);
    return [...keyDatabase];
  },

  // Get key by code (normalized)
  getKeyByCode: (code: string): KeyRecord | null => {
    const normalizedCode = code?.toUpperCase().trim().replace(/-/g, '') || '';
    const key = keyDatabase.find(k => k.code.toUpperCase().replace(/-/g, '') === normalizedCode) || null;
    console.log(`[DB] getKeyByCode: ${code} -> ${normalizedCode}, found: ${!!key}`);
    return key;
  },

  // Get key by ID
  getKeyById: (id: string): KeyRecord | null => {
    const key = keyDatabase.find(k => k.id === id) || null;
    console.log(`[DB] getKeyById: ${id}, found: ${!!key}`);
    return key;
  },

  // Create new key
  createKey: (keyData: Omit<KeyRecord, 'id' | 'createdAt' | 'usageCount' | 'linkedPhones'>): KeyRecord => {
    const newKey: KeyRecord = {
      id: `key-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      usageCount: 0,
      linkedPhones: [],
      ...keyData
    };

    keyDatabase.push(newKey);
    console.log(`[DB] createKey: created ${newKey.id} with code ${newKey.code}`);
    return newKey;
  },

  // Update key
  updateKey: (id: string, updates: Partial<KeyRecord>): KeyRecord | null => {
    const keyIndex = keyDatabase.findIndex(k => k.id === id);
    if (keyIndex === -1) {
      console.error(`[DB] updateKey: key ${id} not found`);
      return null;
    }

    keyDatabase[keyIndex] = { ...keyDatabase[keyIndex], ...updates };
    console.log(`[DB] updateKey: updated ${id} with`, updates);
    return keyDatabase[keyIndex];
  },

  // Activate key
  activateKey: (id: string, activatedBy: string): KeyRecord | null => {
    console.log(`[DB] activateKey: activating ${id} by ${activatedBy}`);
    return keyDB.updateKey(id, {
      status: 'active',
      activatedAt: new Date().toISOString(),
      createdBy: activatedBy
    });
  },

  // Deactivate key
  deactivateKey: (id: string): KeyRecord | null => {
    console.log(`[DB] deactivateKey: deactivating ${id}`);
    return keyDB.updateKey(id, {
      status: 'inactive'
    });
  },

  // Record key usage
  recordUsage: (code: string, phone: string): KeyRecord | null => {
    const key = keyDB.getKeyByCode(code);
    if (!key) {
      console.error(`[DB] recordUsage: key ${code} not found`);
      return null;
    }

    const linkedPhones = key.linkedPhones.includes(phone)
      ? key.linkedPhones
      : [...key.linkedPhones, phone];

    console.log(`[DB] recordUsage: recording usage for ${code} by ${phone}`);
    return keyDB.updateKey(key.id, {
      lastValidatedAt: new Date().toISOString(),
      usageCount: key.usageCount + 1,
      linkedPhones
    });
  },

  // Check if phone has access via any key
  phoneHasAccess: (phone: string): boolean => {
    return keyDatabase.some(key =>
      key.status === 'active' && key.linkedPhones.includes(phone)
    );
  },

  // Get keys by status
  getKeysByStatus: (status: KeyRecord['status']): KeyRecord[] => {
    return keyDatabase.filter(k => k.status === status);
  },

  // Clean expired keys (call periodically)
  cleanExpiredKeys: (): number => {
    const now = new Date();
    const expiredKeys = keyDatabase.filter(key =>
      key.expiresAt && new Date(key.expiresAt) < now
    );

    expiredKeys.forEach(key => {
      keyDB.updateKey(key.id, { status: 'expired' });
    });

    return expiredKeys.length;
  }
};

// Initialize cleanup interval (run every hour)
if (typeof global !== 'undefined') {
  setInterval(() => {
    keyDB.cleanExpiredKeys();
  }, 60 * 60 * 1000); // 1 hour
}