import { AttentionItem, AttentionCategory, PlatformId, UserProfile } from '../types';

export const INITIAL_ATTENTION_ITEMS: AttentionItem[] = [];

const ATTENTION_STORAGE_KEY = 'wihgo_attention_items_v1';

export class AttentionEngine {
  public static getAttentionItems(): AttentionItem[] {
    try {
      const data = localStorage.getItem(ATTENTION_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load attention items from localStorage:', e);
    }
    return INITIAL_ATTENTION_ITEMS;
  }

  public static saveAttentionItems(items: AttentionItem[]) {
    try {
      localStorage.setItem(ATTENTION_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save attention items:', e);
    }
  }

  public static resolveItem(id: string): AttentionItem[] {
    const current = this.getAttentionItems();
    const updated = current.map(item => item.id === id ? { ...item, resolved: true } : item);
    this.saveAttentionItems(updated);
    return updated;
  }

  public static getActiveCountByCategory(): Record<AttentionCategory, number> & { total: number } {
    const items = this.getAttentionItems().filter(i => !i.resolved);
    return {
      urgent: items.filter(i => i.category === 'urgent').length,
      decisions: items.filter(i => i.category === 'decisions').length,
      followups: items.filter(i => i.category === 'followups').length,
      opportunities: items.filter(i => i.category === 'opportunities').length,
      information: items.filter(i => i.category === 'information').length,
      total: items.length
    };
  }

  public static getAll(category?: AttentionCategory): AttentionItem[] {
    const items = this.getAttentionItems().filter(i => !i.resolved);
    if (!category) return items;
    return items.filter(i => i.category === category);
  }

  public static getUrgent(): AttentionItem[] {
    return this.getAll('urgent');
  }

  public static getDecisions(): AttentionItem[] {
    return this.getAll('decisions');
  }

  public static getFollowups(): AttentionItem[] {
    return this.getAll('followups');
  }

  public static getOpportunities(): AttentionItem[] {
    return this.getAll('opportunities');
  }
}
