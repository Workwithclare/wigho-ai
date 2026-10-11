import { AttentionItem, AttentionCategory, PlatformId, UserProfile } from '../types';

export const INITIAL_ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: 'att-1',
    category: 'urgent',
    urgencyLevel: 'critical',
    title: 'Customer Waiting for Response',
    explanation: 'Sarah Jenkins has been waiting 18 hours after asking about the Premium package weekend support SLA. Quick response required to avoid losing client trust.',
    sourcePlatform: 'email',
    entityName: 'Sarah Jenkins (Lumina Design)',
    entityAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    timestamp: '18 hours ago',
    timeAgo: '18h ago',
    actionLabel: 'Open Conversation',
    targetTab: 'inbox',
    targetPlatform: 'email',
    targetId: 'conv-email-1',
    resolved: false
  },
  {
    id: 'att-2',
    category: 'urgent',
    urgencyLevel: 'high',
    title: 'Catalog & Volume Pricing Request',
    explanation: 'David Chen from Apex Tech is ready to license 25 seats for Q3 but is waiting for the revised catalog PDF and Tier 2 discount schedule.',
    sourcePlatform: 'whatsapp',
    entityName: 'David Chen (Apex Tech)',
    entityAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    timestamp: '10:22 AM',
    timeAgo: '2h ago',
    actionLabel: 'Open Conversation',
    targetTab: 'inbox',
    targetPlatform: 'whatsapp',
    targetId: 'conv-wa-1',
    resolved: false
  },
  {
    id: 'att-3',
    category: 'urgent',
    urgencyLevel: 'high',
    title: 'Launch Campaign Assets Approval',
    explanation: 'Alex Vance posted finalized visual creatives in Slack (#marketing-campaigns). The scheduled launch date is tomorrow morning.',
    sourcePlatform: 'slack',
    entityName: 'Alex Vance (#marketing-campaigns)',
    entityAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    timestamp: '09:45 AM',
    timeAgo: '3h ago',
    actionLabel: 'Review Assets',
    targetTab: 'inbox',
    targetPlatform: 'slack',
    targetId: 'conv-slack-1',
    resolved: false
  },
  {
    id: 'att-4',
    category: 'decisions',
    urgencyLevel: 'high',
    title: 'Meeting Agenda Confirmation Required',
    explanation: 'Your 2:00 PM meeting with Nexus Logistics has no confirmed discussion points or slide deck attached. Confirm agenda with stakeholders.',
    sourcePlatform: 'calendar',
    entityName: 'Nexus Logistics Sync',
    timestamp: 'Today, 2:00 PM',
    timeAgo: 'In 3 hours',
    actionLabel: 'Review Meeting',
    targetTab: 'calendar',
    resolved: false
  },
  {
    id: 'att-5',
    category: 'decisions',
    urgencyLevel: 'medium',
    title: 'EU Reseller Discount Approval',
    explanation: 'DistroHub requested a 15% discount on 50-seat annual volume. Needs owner sign-off or counter-offer with 10% + marketing co-op.',
    sourcePlatform: 'email',
    entityName: 'DistroHub EU',
    timestamp: 'Yesterday',
    timeAgo: '1d ago',
    actionLabel: 'Review Decision',
    targetTab: 'business-brain',
    resolved: false
  },
  {
    id: 'att-6',
    category: 'followups',
    urgencyLevel: 'medium',
    title: 'Architecture Blueprint Promised to John Doe',
    explanation: 'Promised John Doe (Acme Corp) a customized Slack & Gmail multi-channel architecture plan by this Friday.',
    sourcePlatform: 'email',
    entityName: 'John Doe (Acme Corp)',
    timestamp: 'Due Friday',
    timeAgo: 'Due in 3 days',
    actionLabel: 'View Commitment',
    targetTab: 'followups',
    resolved: false
  },
  {
    id: 'att-7',
    category: 'opportunities',
    urgencyLevel: 'high',
    title: 'Hot Lead Detected on Instagram',
    explanation: 'Jessica Miller has asked about pricing twice after watching your Connect Hub showcase reel and appears ready to purchase an agency package for 12 seats.',
    sourcePlatform: 'instagram',
    entityName: 'Jessica Miller (@jessica_design32)',
    entityAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    timestamp: '10:30 AM',
    timeAgo: '2h ago',
    actionLabel: 'View Lead & Reply',
    targetTab: 'inbox',
    targetPlatform: 'instagram',
    targetId: 'conv-ig-1',
    resolved: false
  },
  {
    id: 'att-8',
    category: 'opportunities',
    urgencyLevel: 'high',
    title: 'Venture Capital Partnership Inquiry',
    explanation: 'Sarah Johnson from Horizon VC requested a 20-minute intro call this Thursday to discuss growth trajectory and partnership.',
    sourcePlatform: 'email',
    entityName: 'Sarah Johnson (Horizon VC)',
    entityAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    timestamp: '08:15 AM',
    timeAgo: '4h ago',
    actionLabel: 'Schedule Call',
    targetTab: 'inbox',
    targetPlatform: 'email',
    targetId: 'conv-email-1',
    resolved: false
  }
];

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
