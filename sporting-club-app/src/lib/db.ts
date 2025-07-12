import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SportingClubDB extends DBSchema {
  sports: {
    key: string;
    value: {
      id: string;
      name: string;
      description: string;
      category: string;
      maxMembers?: number;
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: { 'by-category': string };
  };
  members: {
    key: string;
    value: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth: Date;
      address: string;
      membershipDate: Date;
      status: 'active' | 'inactive';
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: { 'by-email': string; 'by-status': string };
  };
  subscriptions: {
    key: string;
    value: {
      id: string;
      memberId: string;
      sportId: string;
      subscriptionDate: Date;
      status: 'active' | 'cancelled';
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: { 'by-member': string; 'by-sport': string; 'by-member-sport': [string, string] };
  };
}

class SportingClubService {
  private db: IDBPDatabase<SportingClubDB> | null = null;
  private readonly DB_NAME = 'SportingClubDB';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    this.db = await openDB<SportingClubDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {

        const sportsStore = db.createObjectStore('sports', { keyPath: 'id' });
        sportsStore.createIndex('by-category', 'category');

        // Members store
        const membersStore = db.createObjectStore('members', { keyPath: 'id' });
        membersStore.createIndex('by-email', 'email', { unique: true });
        membersStore.createIndex('by-status', 'status');

        // Subscriptions store
        const subscriptionsStore = db.createObjectStore('subscriptions', { keyPath: 'id' });
        subscriptionsStore.createIndex('by-member', 'memberId');
        subscriptionsStore.createIndex('by-sport', 'sportId');
        subscriptionsStore.createIndex('by-member-sport', ['memberId', 'sportId'], { unique: true });
      },
    });

    // Add some initial data if database is empty
    await this.seedInitialData();
  }

  private async seedInitialData(): Promise<void> {
    const sports = await this.getAllSports();
    if (sports.length === 0) {
      // Add some initial sports
      const initialSports = [
        { name: 'Football', description: 'Association football', category: 'Team Sports' },
        { name: 'Basketball', description: 'Indoor basketball', category: 'Team Sports' },
        { name: 'Tennis', description: 'Individual or doubles tennis', category: 'Racquet Sports' },
        { name: 'Swimming', description: 'Competitive swimming', category: 'Water Sports' },
        { name: 'Volleyball', description: 'Indoor volleyball', category: 'Team Sports' },
      ];

      for (const sport of initialSports) {
        await this.addSport(sport);
      }
    }
  }

  private ensureDB(): IDBPDatabase<SportingClubDB> {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.db;
  }

  // Sports operations
  async addSport(sport: Omit<SportingClubDB['sports']['value'], 'id' | 'createdAt' | 'updatedAt'>) {
    const db = this.ensureDB();
    const id = crypto.randomUUID();
    const now = new Date();
    
    const sportData: SportingClubDB['sports']['value'] = {
      ...sport,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await db.add('sports', sportData);
    return sportData;
  }

  async getSport(id: string) {
    const db = this.ensureDB();
    return await db.get('sports', id);
  }

  async getAllSports() {
    const db = this.ensureDB();
    return await db.getAll('sports');
  }

  async updateSport(id: string, updates: Partial<Omit<SportingClubDB['sports']['value'], 'id' | 'createdAt'>>) {
    const db = this.ensureDB();
    const sport = await db.get('sports', id);
    if (!sport) throw new Error('Sport not found');

    const updatedSport = {
      ...sport,
      ...updates,
      updatedAt: new Date(),
    };

    await db.put('sports', updatedSport);
    return updatedSport;
  }

  async deleteSport(id: string) {
    const db = this.ensureDB();
    await db.delete('sports', id);
  }

  // Members operations
  async addMember(member: Omit<SportingClubDB['members']['value'], 'id' | 'createdAt' | 'updatedAt'>) {
    const db = this.ensureDB();
    const id = crypto.randomUUID();
    const now = new Date();
    
    const memberData: SportingClubDB['members']['value'] = {
      ...member,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await db.add('members', memberData);
    return memberData;
  }

  async getMember(id: string) {
    const db = this.ensureDB();
    return await db.get('members', id);
  }

  async getAllMembers() {
    const db = this.ensureDB();
    return await db.getAll('members');
  }

  async updateMember(id: string, updates: Partial<Omit<SportingClubDB['members']['value'], 'id' | 'createdAt'>>) {
    const db = this.ensureDB();
    const member = await db.get('members', id);
    if (!member) throw new Error('Member not found');

    const updatedMember = {
      ...member,
      ...updates,
      updatedAt: new Date(),
    };

    await db.put('members', updatedMember);
    return updatedMember;
  }

  async deleteMember(id: string) {
    const db = this.ensureDB();
    await db.delete('members', id);
  }

  // Subscriptions operations
  async subscribeMemberToSport(memberId: string, sportId: string) {
    const db = this.ensureDB();
    
    // Check if subscription already exists
    const existing = await this.getSubscription(memberId, sportId);
    if (existing && existing.status === 'active') {
      throw new Error('Member is already subscribed to this sport');
    }

    const id = crypto.randomUUID();
    const now = new Date();
    
    const subscriptionData: SportingClubDB['subscriptions']['value'] = {
      id,
      memberId,
      sportId,
      subscriptionDate: now,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    await db.add('subscriptions', subscriptionData);
    return subscriptionData;
  }

  async getSubscription(memberId: string, sportId: string) {
    const db = this.ensureDB();
    try {
      return await db.getFromIndex('subscriptions', 'by-member-sport', [memberId, sportId]);
    } catch {
      return null;
    }
  }

  async getMemberSubscriptions(memberId: string) {
    const db = this.ensureDB();
    return await db.getAllFromIndex('subscriptions', 'by-member', memberId);
  }

  async getSportSubscriptions(sportId: string) {
    const db = this.ensureDB();
    return await db.getAllFromIndex('subscriptions', 'by-sport', sportId);
  }

  async getAllSubscriptions() {
    const db = this.ensureDB();
    return await db.getAll('subscriptions');
  }

  async cancelSubscription(memberId: string, sportId: string) {
    const db = this.ensureDB();
    const subscription = await this.getSubscription(memberId, sportId);
    if (!subscription) throw new Error('Subscription not found');

    const updatedSubscription = {
      ...subscription,
      status: 'cancelled' as const,
      updatedAt: new Date(),
    };

    await db.put('subscriptions', updatedSubscription);
    return updatedSubscription;
  }

  // Enhanced queries
  async getMemberWithSports(memberId: string) {
    const member = await this.getMember(memberId);
    if (!member) return null;

    const subscriptions = await this.getMemberSubscriptions(memberId);
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
    
    const sports = await Promise.all(
      activeSubscriptions.map(sub => this.getSport(sub.sportId))
    );

    return {
      ...member,
      sports: sports.filter(Boolean),
      subscriptions: activeSubscriptions,
    };
  }

  async getSportWithMembers(sportId: string) {
    const sport = await this.getSport(sportId);
    if (!sport) return null;

    const subscriptions = await this.getSportSubscriptions(sportId);
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
    
    const members = await Promise.all(
      activeSubscriptions.map(sub => this.getMember(sub.memberId))
    );

    return {
      ...sport,
      members: members.filter(Boolean),
      subscriptions: activeSubscriptions,
      memberCount: activeSubscriptions.length,
    };
  }

  async clearAllData() {
    const db = this.ensureDB();
    const tx = db.transaction(['sports', 'members', 'subscriptions'], 'readwrite');
    
    await Promise.all([
      tx.objectStore('sports').clear(),
      tx.objectStore('members').clear(),
      tx.objectStore('subscriptions').clear(),
    ]);
  }

  async close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}


export const sportingClubService = new SportingClubService();
export type { SportingClubDB };