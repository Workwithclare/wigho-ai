import { BusinessInsightItem, BusinessContextRelation, PlatformId } from '../types';

export const INITIAL_BUSINESS_INSIGHTS: BusinessInsightItem[] = [
  {
    id: 'ins-1',
    category: 'buying_intent',
    title: 'High Buying Intent Detected from Social to Messaging',
    explanation: 'Jessica Miller (@jessica_design32) watched the Connect Hub reel and initiated 2 inquiries on Instagram regarding 12-seat agency deployment within 48 hours.',
    sourceContext: 'Instagram DMs + Reel Engagement Analytics',
    sourcePlatform: 'instagram',
    recommendedAction: 'Send Custom Agency Tier Proposal & Offer 15-minute onboarding demo.',
    severity: 'high',
    impactMetric: 'Potential +$9,600 ARR',
    entityName: 'Jessica Miller (Miller Creative)',
    targetTab: 'inbox',
    targetPlatform: 'instagram',
    targetId: 'conv-ig-1'
  },
  {
    id: 'ins-2',
    category: 'sla_risk',
    title: 'Client Response SLA Threshold Exceeded',
    explanation: 'Sarah Jenkins (Lumina Design) sent an email 18 hours ago inquiring about weekend SLA escalation policies. Response latency is currently above the 4-hour target.',
    sourceContext: 'Gmail integration thread #lumina-support',
    sourcePlatform: 'email',
    recommendedAction: 'Review AI-drafted reply and confirm send to restore SLA compliance.',
    severity: 'high',
    impactMetric: '18h Latency (Target: <4h)',
    entityName: 'Sarah Jenkins (Lumina Design)',
    targetTab: 'inbox',
    targetPlatform: 'email',
    targetId: 'conv-email-1'
  },
  {
    id: 'ins-3',
    category: 'recurring_inquiry',
    title: 'Frequent Inquiry: Volume Pricing & Tier 2 Licensing',
    explanation: '3 separate high-intent leads this week (Apex Tech, Horizon VC partner network, Miller Creative) asked for Tier 2 seat volume pricing breakdowns.',
    sourceContext: 'Cross-platform pattern (WhatsApp + Email + Instagram)',
    sourcePlatform: 'multi-platform',
    recommendedAction: 'Publish updated Q3 Volume Tier Cheat Sheet in Business Brain directives.',
    severity: 'medium',
    impactMetric: '3 Inquiries / 7 Days',
    entityName: 'Volume Pricing Policy'
  },
  {
    id: 'ins-4',
    category: 'relationship_opportunity',
    title: 'Venture Capital Partnership Intro Window',
    explanation: 'Sarah Johnson from Horizon VC requested a 20-minute intro call. Their investment focus aligns directly with unified business communication platforms.',
    sourceContext: 'Email from sjohnson@horizonvc.io',
    sourcePlatform: 'email',
    recommendedAction: 'Confirm Thursday 2:00 PM EST slot with attached Product Deck.',
    severity: 'high',
    impactMetric: 'Strategic Growth',
    entityName: 'Sarah Johnson (Horizon VC)',
    targetTab: 'calendar'
  },
  {
    id: 'ins-5',
    category: 'bottleneck',
    title: 'Pending Deliverable: Acme Corp Architecture Blueprint',
    explanation: 'A customized multi-channel architecture plan was promised to John Doe by Friday 5:00 PM. No draft is currently attached in Google Drive or Gmail.',
    sourceContext: 'Email Thread: Architecture Review with Acme Corp',
    sourcePlatform: 'email',
    recommendedAction: 'Review Google Drive template and prepare draft before Friday morning.',
    severity: 'medium',
    impactMetric: 'Due in 3 Days',
    entityName: 'John Doe (Acme Corp)',
    targetTab: 'tasks'
  }
];

export const INITIAL_BUSINESS_CONTEXT_RELATIONS: BusinessContextRelation[] = [
  {
    id: 'rel-sarah-jenkins',
    customerName: 'Sarah Jenkins',
    companyName: 'Lumina Design Studio',
    handle: 'sjenkins@luminadesign.com',
    conversations: [
      {
        id: 'c-1',
        platform: 'email',
        summary: 'Inquired about Premium package weekend support SLA guarantees and response timelines.',
        date: '18 hours ago'
      },
      {
        id: 'c-2',
        platform: 'whatsapp',
        summary: 'Exchanged quick greeting and requested formal proposal via email.',
        date: '2 days ago'
      }
    ],
    emails: [
      {
        id: 'em-1',
        subject: 'Premium Package Support SLA Inquiry',
        snippet: 'Can you confirm if dedicated weekend Slack coverage is included in the Pro tier?',
        date: 'Yesterday, 6:30 PM'
      },
      {
        id: 'em-2',
        subject: 'Lumina Design x WIHGO Intro Proposal',
        snippet: 'Attached is our overview presentation for Lumina Design team onboarding.',
        date: '3 days ago'
      }
    ],
    meetings: [
      {
        id: 'mt-1',
        title: 'Lumina Design Capabilities Demo',
        date: 'Last Thursday',
        status: 'completed'
      }
    ],
    tasks: [
      {
        id: 'tk-1',
        title: 'Reply to Sarah regarding 24/7 weekend SLA policy',
        status: 'pending'
      }
    ],
    decisions: [
      {
        id: 'dec-1',
        decisionText: 'Agreed to offer 4-hour weekend response window for Lumina annual contract.',
        date: 'Yesterday'
      }
    ],
    commitments: [
      {
        id: 'com-1',
        promiseText: 'Provide written SLA guarantee and weekend support terms.',
        dueDate: 'Today',
        status: 'pending'
      }
    ],
    currentStatus: 'Awaiting SLA Response from WIHGO Owner',
    recommendedAction: 'Send approved SLA terms via email to finalize annual commitment.'
  },
  {
    id: 'rel-david-chen',
    customerName: 'David Chen',
    companyName: 'Apex Tech Solutions',
    handle: '+1 (555) 234-5678',
    conversations: [
      {
        id: 'c-3',
        platform: 'whatsapp',
        summary: 'Requested revised Q3 product catalog PDF and Tier 2 seat volume discount schedule.',
        date: 'Today, 10:22 AM'
      }
    ],
    emails: [
      {
        id: 'em-3',
        subject: 'Apex Tech Seat Licensing Requirements',
        snippet: 'We are expanding to 25 seats for our operations department and want to centralize customer chats.',
        date: '2 days ago'
      }
    ],
    meetings: [
      {
        id: 'mt-2',
        title: 'Apex Tech Quarterly Workflow Alignment',
        date: 'Tomorrow, 11:00 AM',
        status: 'scheduled'
      }
    ],
    tasks: [
      {
        id: 'tk-2',
        title: 'Export Q3 PDF Catalog and Volume Tier Matrix for David',
        status: 'pending'
      }
    ],
    decisions: [
      {
        id: 'dec-2',
        decisionText: 'Approved 15% discount for 25+ seat annual commitment.',
        date: 'This morning'
      }
    ],
    commitments: [
      {
        id: 'com-2',
        promiseText: 'Deliver Q3 volume discount tiers schedule today.',
        dueDate: 'Today (COB)',
        status: 'pending'
      }
    ],
    currentStatus: 'Active Negotiation — High Intent',
    recommendedAction: 'Send updated catalog PDF on WhatsApp and confirm tomorrow 11:00 AM sync.'
  },
  {
    id: 'rel-jessica-miller',
    customerName: 'Jessica Miller',
    companyName: 'Miller Creative Studio',
    handle: '@jessica_design32',
    conversations: [
      {
        id: 'c-4',
        platform: 'instagram',
        summary: 'High-intent lead: Inquired twice regarding agency reseller package and managing 12 client accounts.',
        date: 'Today, 10:30 AM'
      }
    ],
    emails: [],
    meetings: [
      {
        id: 'mt-3',
        title: 'Miller Creative Discovery Call',
        date: 'Proposed Friday',
        status: 'scheduled'
      }
    ],
    tasks: [
      {
        id: 'tk-3',
        title: 'Send Agency Partnership Deck to Jessica via Instagram DM',
        status: 'pending'
      }
    ],
    decisions: [
      {
        id: 'dec-3',
        decisionText: 'Classified Jessica as VIP Agency Partner candidate.',
        date: 'Today'
      }
    ],
    commitments: [
      {
        id: 'com-3',
        promiseText: 'Send Partner Deck and client account demo access.',
        dueDate: 'Tomorrow',
        status: 'pending'
      }
    ],
    currentStatus: 'Hot Lead — Inbound from Social Reel',
    recommendedAction: 'Send partnership deck link and offer Friday morning walkthrough.'
  }
];

const INSIGHTS_STORAGE_KEY = 'wihgo_business_insights_v1';

export class BusinessInsightsService {
  public static getInsights(): BusinessInsightItem[] {
    try {
      const data = localStorage.getItem(INSIGHTS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load insights:', e);
    }
    return INITIAL_BUSINESS_INSIGHTS;
  }

  public static getContextRelations(): BusinessContextRelation[] {
    return INITIAL_BUSINESS_CONTEXT_RELATIONS;
  }

  public static getRelationForCustomer(nameOrHandle: string): BusinessContextRelation | undefined {
    const q = nameOrHandle.toLowerCase();
    return INITIAL_BUSINESS_CONTEXT_RELATIONS.find(r => 
      r.customerName.toLowerCase().includes(q) ||
      r.companyName.toLowerCase().includes(q) ||
      (r.handle && r.handle.toLowerCase().includes(q))
    );
  }
}
