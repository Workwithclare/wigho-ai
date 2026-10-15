import { 
  BusinessMemoryItem, 
  BusinessEntityType, 
  Commitment, 
  ContinuityContext, 
  PlatformId 
} from '../types';

const MEMORY_STORAGE_KEY = 'wihgo_business_memory_v1';
const COMMITMENTS_STORAGE_KEY = 'wihgo_commitments_v1';

export const INITIAL_BUSINESS_MEMORIES: BusinessMemoryItem[] = [];

export const INITIAL_COMMITMENTS: Commitment[] = [];

export class BusinessMemoryService {
  private static getStoredMemories(): BusinessMemoryItem[] {
    try {
      const data = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load memories from localStorage:', e);
    }
    return INITIAL_BUSINESS_MEMORIES;
  }

  private static saveMemories(items: BusinessMemoryItem[]) {
    try {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save memories to localStorage:', e);
    }
  }

  public static getAllMemories(): BusinessMemoryItem[] {
    return this.getStoredMemories();
  }

  public static getRecent(limit: number = 10): BusinessMemoryItem[] {
    return this.getStoredMemories().slice(0, limit);
  }

  public static addMemory(item: Omit<BusinessMemoryItem, 'id' | 'date'>): BusinessMemoryItem {
    const newItem: BusinessMemoryItem = {
      ...item,
      id: `mem-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    const current = this.getStoredMemories();
    const updated = [newItem, ...current];
    this.saveMemories(updated);
    return newItem;
  }

  public static getMemoriesByEntity(entityType: BusinessEntityType): BusinessMemoryItem[] {
    return this.getStoredMemories().filter(m => m.entityType === entityType);
  }

  public static getMemoriesForCustomer(customerNameOrHandle: string): BusinessMemoryItem[] {
    const q = customerNameOrHandle.toLowerCase();
    return this.getStoredMemories().filter(m => 
      m.entityName.toLowerCase().includes(q) || 
      (m.contactHandle && m.contactHandle.toLowerCase().includes(q)) ||
      (m.relatedCustomer && m.relatedCustomer.toLowerCase().includes(q)) ||
      m.detail.toLowerCase().includes(q)
    );
  }

  public static getCommitments(): Commitment[] {
    try {
      const data = localStorage.getItem(COMMITMENTS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load commitments:', e);
    }
    return INITIAL_COMMITMENTS;
  }

  public static addCommitment(c: Omit<Commitment, 'id'>): Commitment {
    const newCom: Commitment = {
      ...c,
      id: `com-${Date.now()}`
    };
    const current = this.getCommitments();
    const updated = [newCom, ...current];
    try {
      localStorage.setItem(COMMITMENTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save commitment:', e);
    }
    return newCom;
  }

  public static updateCommitmentStatus(id: string, status: Commitment['status']) {
    const current = this.getCommitments();
    const updated = current.map(c => c.id === id ? { ...c, status } : c);
    try {
      localStorage.setItem(COMMITMENTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update commitment:', e);
    }
  }

  // Continuity Context Provider for Conversation Screens
  public static getContinuityContext(customerName: string, platform: PlatformId = 'whatsapp'): ContinuityContext {
    const memories = this.getMemoriesForCustomer(customerName);
    const commitments = this.getCommitments().filter(c => 
      c.toWhom.toLowerCase().includes(customerName.toLowerCase()) ||
      customerName.toLowerCase().includes(c.toWhom.toLowerCase().split(' ')[0])
    );

    // No canned persona contexts: build only from real stored data.
    // Default synthesized continuity context
    return {
      id: `cont-${Date.now()}`,
      customerName,
      platform,
      previousInteraction: memories[0]?.detail || 'Initial inquiry received across connected channel.',
      previousResponse: 'Automated acknowledgment or previous team reply.',
      currentStatus: 'Active business thread.',
      recommendedNextAction: 'Review thread history and send contextual follow-up.',
      commitments,
      responsiblePerson: 'Owner',
      lastInteractionDate: 'Recent',
      intentCategory: 'general'
    };
  }

  // Natural Language Search Engine for Business Memory
  public static searchBusinessMemory(naturalLanguageQuery: string): {
    matchedMemories: BusinessMemoryItem[];
    synthesizedAnswer: string;
    entitiesFound: string[];
  } {
    const q = naturalLanguageQuery.toLowerCase().trim();
    const all = this.getStoredMemories();
    const commitments = this.getCommitments();

    // Query 1: name lookup
    {
      const hits = all.filter(m => m.entityName.toLowerCase().includes(q) || m.detail.toLowerCase().includes(q));
      if (hits.length > 0) {
        return {
          matchedMemories: hits,
          synthesizedAnswer: `Found ${hits.length} record(s) matching "${naturalLanguageQuery}".`,
          entitiesFound: Array.from(new Set(hits.map(m => m.entityName)))
        };
      }
    }

    // Query 2: Waiting for a response / Unanswered
    if (q.includes('waiting') || q.includes('response') || q.includes('unanswered') || q.includes('pending reply')) {
      const waiting = all.filter(m => m.status === 'pending' || m.actionRequired);
      return {
        matchedMemories: waiting,
        synthesizedAnswer: waiting.length > 0 ? `Found ${waiting.length} item(s) waiting for a response. Review them in Follow-Ups.` : `Nothing is waiting for a response. Add a follow-up to start tracking.`,
        entitiesFound: Array.from(new Set(waiting.map(m => m.entityName)))
      };
    }

    // Query 3: Promise / Commitment / John
    if (q.includes('promise') || q.includes('commitment') || q.includes('john')) {
      const promiseMemories = all.filter(m => m.entityType === 'commitment' || m.entityName.toLowerCase().includes('john'));
      return {
        matchedMemories: promiseMemories,
        synthesizedAnswer: promiseMemories.length > 0 ? `Found ${promiseMemories.length} commitment record(s).` : `No commitments on record yet. Add your first follow-up with a promise and deadline.`,
        entitiesFound: Array.from(new Set(promiseMemories.map(m => m.entityName)))
      };
    }

    // Query 4: Customer lookup ("Show me everything related to...")
    const matched = all.filter(m => 
      m.entityName.toLowerCase().includes(q) ||
      m.detail.toLowerCase().includes(q) ||
      m.tags.some(t => q.includes(t)) ||
      m.title.toLowerCase().includes(q)
    );

    if (matched.length > 0) {
      return {
        matchedMemories: matched,
        synthesizedAnswer: `Found ${matched.length} business memory record(s) matching "${naturalLanguageQuery}".`,
        entitiesFound: Array.from(new Set(matched.map(m => m.entityName)))
      };
    }

    return {
      matchedMemories: all.slice(0, 4),
      synthesizedAnswer: `Here are the latest active business memory records across your connected channels. You can filter by Customer, Lead, Commitment, or Decision.`,
      entitiesFound: []
    };
  }
}
