import { 
  BusinessMemoryItem, 
  BusinessEntityType, 
  Commitment, 
  ContinuityContext, 
  PlatformId 
} from '../types';

const MEMORY_STORAGE_KEY = 'wihgo_business_memory_v1';
const COMMITMENTS_STORAGE_KEY = 'wihgo_commitments_v1';

export const INITIAL_BUSINESS_MEMORIES: BusinessMemoryItem[] = [
  {
    id: 'mem-1',
    entityType: 'customer',
    entityName: 'David Chen',
    contactHandle: '+1 (555) 234-5678',
    platform: 'whatsapp',
    title: 'Requested Q3 Product Catalog & Tier 2 Pricing',
    detail: 'David requested updated Q3 product catalog and volume tier pricing on WhatsApp. Mentioned Apex Tech plans to onboard 25 team seats by end of quarter.',
    date: '2026-08-18',
    tags: ['pricing', 'tier-2', 'apex-tech', 'volume-license'],
    sentiment: 'positive',
    status: 'pending',
    confidence: 0.95,
    extractedFrom: 'WhatsApp Conversation with David Chen',
    relatedCustomer: 'David Chen',
    amountOrValue: '$12,500/yr',
    dueDateOrTime: 'Today',
    actionRequired: true
  },
  {
    id: 'mem-2',
    entityType: 'commitment',
    entityName: 'John Doe (Acme Corp)',
    contactHandle: 'johndoe@acmecorp.com',
    platform: 'email',
    title: 'Promised Customized Multi-Channel Integration Plan by Friday',
    detail: 'We promised John Doe a personalized architecture plan detailing how WIHGO syncs their Slack, Gmail, and WhatsApp streams without data overlap.',
    date: '2026-08-17',
    tags: ['promise', 'architecture-plan', 'acme-corp', 'friday-deadline'],
    sentiment: 'urgent',
    status: 'pending',
    confidence: 0.98,
    extractedFrom: 'Email Thread: Architecture Review with Acme Corp',
    relatedCustomer: 'John Doe',
    dueDateOrTime: 'This Friday (5:00 PM)',
    actionRequired: true
  },
  {
    id: 'mem-3',
    entityType: 'lead',
    entityName: 'Jessica Miller',
    contactHandle: '@jessica_design32',
    platform: 'instagram',
    title: 'High-Intent Agency Partnership Lead from Instagram Reel',
    detail: 'Jessica messaged twice about partnering for Q3 after seeing our Connect Hub showcase reel. Runs a 12-person creative agency looking to manage client communication.',
    date: '2026-08-18',
    tags: ['partnership', 'instagram-dm', 'agency', 'hot-lead'],
    sentiment: 'positive',
    status: 'active',
    confidence: 0.92,
    extractedFrom: 'Instagram DM with @jessica_design32',
    relatedCustomer: 'Jessica Miller',
    actionRequired: true
  },
  {
    id: 'mem-4',
    entityType: 'opportunity',
    entityName: 'Sarah Johnson',
    contactHandle: 'sjohnson@horizonvc.io',
    platform: 'email',
    title: 'Horizon VC Strategic Partnership & Investment Discussion',
    detail: 'Sarah Johnson from Horizon VC requested a 20-minute introductory call for Thursday to discuss investment thesis and growth metrics for WIHGO AI.',
    date: '2026-08-18',
    tags: ['investment', 'venture-capital', 'partnership', 'strategic'],
    sentiment: 'positive',
    status: 'pending',
    confidence: 0.97,
    extractedFrom: 'Gmail Thread: WIHGO AI Partnership & Investment',
    relatedCustomer: 'Sarah Johnson',
    dueDateOrTime: 'Thursday 2:00 PM',
    actionRequired: true
  },
  {
    id: 'mem-5',
    entityType: 'decision',
    entityName: 'Product Launch Campaign',
    platform: 'slack',
    title: 'Final Approval for Marketing Assets on Slack (#marketing-campaigns)',
    detail: 'Alex Vance posted the finalized launch assets on Slack channel #marketing-campaigns awaiting final owner sign-off before social scheduling.',
    date: '2026-08-18',
    tags: ['approval', 'slack', 'campaign', 'launch'],
    sentiment: 'urgent',
    status: 'pending',
    confidence: 0.94,
    extractedFrom: 'Slack: #marketing-campaigns',
    actionRequired: true
  },
  {
    id: 'mem-6',
    entityType: 'customer',
    entityName: 'Sarah Jenkins',
    contactHandle: 'sarah.j@lumina.design',
    platform: 'email',
    title: 'Premium Package Support SLA Inquiry (Waiting 18 hours)',
    detail: 'Sarah inquired whether the Premium tier includes dedicated weekend SLA support for client emergencies. Customer waiting for confirmation.',
    date: '2026-08-17',
    tags: ['support-sla', 'premium', 'customer-waiting'],
    sentiment: 'urgent',
    status: 'pending',
    confidence: 0.96,
    extractedFrom: 'Email: Premium Package Support Terms',
    relatedCustomer: 'Sarah Jenkins',
    dueDateOrTime: 'Overdue (18h elapsed)',
    actionRequired: true
  },
  {
    id: 'mem-7',
    entityType: 'meeting',
    entityName: 'Enterprise Client Review',
    platform: 'calendar',
    title: '2:00 PM Strategic Sync with Nexus Logistics - Missing Confirmed Agenda',
    detail: 'Calendar event scheduled for 2:00 PM has no confirmed discussion points or slide deck attached. Requires quick agenda confirmation with stakeholders.',
    date: '2026-08-18',
    tags: ['meeting', 'agenda-missing', 'nexus-logistics'],
    sentiment: 'caution',
    status: 'pending',
    confidence: 0.9,
    extractedFrom: 'Google Calendar Event',
    dueDateOrTime: 'Today 2:00 PM',
    actionRequired: true
  },
  {
    id: 'mem-8',
    entityType: 'decision',
    entityName: 'Global Distro Agreement',
    contactHandle: 'contact@distrohub.eu',
    platform: 'email',
    title: 'Discount Threshold Approval for EU Reseller Partner',
    detail: 'DistroHub requested a 15% discount on 50-seat annual licenses. Needs owner decision on whether to accept or counter with 10% + marketing co-op.',
    date: '2026-08-16',
    tags: ['discount', 'decision', 'eu-partner', 'pricing-policy'],
    sentiment: 'neutral',
    status: 'pending',
    confidence: 0.91,
    extractedFrom: 'Email: Partner Terms DistroHub',
    amountOrValue: '€18,000/yr',
    actionRequired: true
  }
];

export const INITIAL_COMMITMENTS: Commitment[] = [
  {
    id: 'com-1',
    whoPromised: 'Clare (WIHGO Owner)',
    toWhom: 'John Doe (Acme Corp)',
    promiseText: 'Send customized multi-channel architecture plan detailing Slack & Gmail sync.',
    dueDate: '2026-08-22',
    status: 'pending',
    platform: 'email',
    notes: 'High priority enterprise account.'
  },
  {
    id: 'com-2',
    whoPromised: 'Clare (WIHGO Owner)',
    toWhom: 'David Chen (Apex Tech)',
    promiseText: 'Deliver revised Q3 volume discount tiers and catalog PDF.',
    dueDate: '2026-08-18',
    status: 'in_progress',
    platform: 'whatsapp',
    notes: 'Requested during yesterday sync call.'
  },
  {
    id: 'com-3',
    whoPromised: 'Alex Vance',
    toWhom: 'Clare (Owner)',
    promiseText: 'Deliver finalized visual assets for WIHGO social launch.',
    dueDate: '2026-08-18',
    status: 'fulfilled',
    platform: 'slack',
    notes: 'Delivered in #marketing-campaigns.'
  }
];

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

    const isSarah = customerName.toLowerCase().includes('sarah');
    const isDavid = customerName.toLowerCase().includes('david');
    const isJessica = customerName.toLowerCase().includes('jessica');
    const isJohn = customerName.toLowerCase().includes('john');

    if (isDavid) {
      return {
        id: 'cont-david',
        customerName: 'David Chen',
        handle: '+1 (555) 234-5678',
        platform: 'whatsapp',
        companyName: 'Apex Tech Solutions',
        previousInteraction: 'Customer requested updated Q3 product catalog and volume tier pricing.',
        previousResponse: 'Confirmed review of proposal from yesterday sync.',
        currentStatus: 'Waiting for Q3 catalog and pricing confirmation.',
        recommendedNextAction: 'Send updated PDF catalog + invite for 10-min pricing walkthrough.',
        commitments: commitments.length > 0 ? commitments : [
          {
            id: 'c-david',
            whoPromised: 'Clare (Owner)',
            toWhom: 'David Chen',
            promiseText: 'Deliver Q3 volume discount tiers today',
            dueDate: 'Today',
            status: 'pending'
          }
        ],
        responsiblePerson: 'Clare (WIHGO Owner)',
        keyPreferences: ['Prefers WhatsApp for quick approvals', 'Needs 25+ seats', 'Net-30 invoicing'],
        lastInteractionDate: 'Today, 10:22 AM',
        intentCategory: 'pricing_inquiry'
      };
    }

    if (isSarah) {
      return {
        id: 'cont-sarah',
        customerName: 'Sarah Johnson',
        handle: 'sjohnson@horizonvc.io',
        platform: 'email',
        companyName: 'Horizon Venture Capital',
        previousInteraction: 'Requested 20-minute intro call to discuss investment thesis and unified communication metrics.',
        previousResponse: 'Initial email received.',
        currentStatus: 'Awaiting scheduling confirmation for Thursday call.',
        recommendedNextAction: 'Confirm 2:00 PM EST slot and send Google Meet link.',
        commitments: commitments,
        responsiblePerson: 'Clare (Owner)',
        keyPreferences: ['Prefers Google Meet', 'Interested in ARR & user retention'],
        lastInteractionDate: 'Today, 08:15 AM',
        intentCategory: 'partnership'
      };
    }

    if (isJessica) {
      return {
        id: 'cont-jessica',
        customerName: 'Jessica Miller',
        handle: '@jessica_design32',
        platform: 'instagram',
        companyName: 'Miller Creative Studio',
        previousInteraction: 'Complimented AI Connect Hub showcase reel and inquired twice about Q3 agency partnership.',
        previousResponse: 'Sent warm acknowledgment and offered partner guide.',
        currentStatus: 'Hot Lead — evaluating agency reseller tier.',
        recommendedNextAction: 'Send Agency Partnership Deck and book discovery demo.',
        commitments: commitments,
        responsiblePerson: 'Clare (Owner)',
        keyPreferences: ['Active on Instagram', 'Manages 12 designer accounts'],
        lastInteractionDate: 'Today, 10:30 AM',
        intentCategory: 'high_purchase_intent'
      };
    }

    if (isJohn) {
      return {
        id: 'cont-john',
        customerName: 'John Doe',
        handle: 'johndoe@acmecorp.com',
        platform: 'email',
        companyName: 'Acme Corporation',
        previousInteraction: 'Detailed discovery call discussing enterprise Slack and Gmail synchronization.',
        previousResponse: 'Promised multi-channel architecture plan by Friday.',
        currentStatus: 'Architecture blueprint in progress.',
        recommendedNextAction: 'Finalize PDF blueprint and send before Friday 5 PM.',
        commitments: commitments.length > 0 ? commitments : [
          {
            id: 'c-john',
            whoPromised: 'Clare (Owner)',
            toWhom: 'John Doe',
            promiseText: 'Customized multi-channel architecture plan by Friday',
            dueDate: 'Friday',
            status: 'pending'
          }
        ],
        responsiblePerson: 'Clare (Owner)',
        keyPreferences: ['Enterprise SOC2 compliance', 'Prefers Email & Slack'],
        lastInteractionDate: 'Yesterday, 4:15 PM',
        intentCategory: 'pricing_inquiry'
      };
    }

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
      responsiblePerson: 'Clare (Owner)',
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

    // Query 1: Sarah
    if (q.includes('sarah')) {
      const sarahMemories = all.filter(m => m.entityName.toLowerCase().includes('sarah') || m.detail.toLowerCase().includes('sarah'));
      return {
        matchedMemories: sarahMemories,
        synthesizedAnswer: `Here is what we have recorded for Sarah:\n1. Sarah Johnson (Horizon VC): Inquired about an introductory investment call for Thursday (2:00 PM) regarding WIHGO AI's growth thesis.\n2. Sarah Jenkins (Lumina Design): Inquired about Premium tier dedicated weekend support terms (Customer has been waiting for response).`,
        entitiesFound: ['Sarah Johnson', 'Sarah Jenkins', 'Horizon VC', 'Lumina Design']
      };
    }

    // Query 2: Waiting for a response / Unanswered
    if (q.includes('waiting') || q.includes('response') || q.includes('unanswered') || q.includes('pending reply')) {
      const waiting = all.filter(m => m.status === 'pending' || m.actionRequired);
      return {
        matchedMemories: waiting,
        synthesizedAnswer: `Currently, 3 customers/contacts are waiting for a response:\n1. Sarah Jenkins (Email): Inquired about Premium support SLA (waiting 18h).\n2. David Chen (WhatsApp): Waiting for updated Q3 product catalog and volume tier pricing.\n3. Jessica Miller (Instagram): Inquired about Q3 agency partnership terms.`,
        entitiesFound: ['Sarah Jenkins', 'David Chen', 'Jessica Miller']
      };
    }

    // Query 3: Promise / Commitment / John
    if (q.includes('promise') || q.includes('commitment') || q.includes('john')) {
      const promiseMemories = all.filter(m => m.entityType === 'commitment' || m.entityName.toLowerCase().includes('john'));
      return {
        matchedMemories: promiseMemories,
        synthesizedAnswer: `Commitments & Promises on record:\n• To John Doe (Acme Corp): Promised a customized multi-channel architecture plan detailing Hash & Gmail synchronization by this Friday.\n• To David Chen (Apex Tech): Promised revised Q3 volume discount tiers and catalog PDF today.`,
        entitiesFound: ['John Doe', 'Acme Corp', 'David Chen', 'Apex Tech']
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
      entitiesFound: ['David Chen', 'Sarah Johnson', 'Jessica Miller', 'John Doe']
    };
  }
}
