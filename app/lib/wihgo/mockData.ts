import { 
  PlatformInfo, 
  Conversation, 
  AITool, 
  CalendarEvent, 
  Task, 
  Reminder, 
  NotificationItem, 
  UserProfile, 
  DailySparkItem,
  FollowUpItem,
  AIMemoryRule
} from './types';

export const INITIAL_PLATFORMS: PlatformInfo[] = [
  {
    id: 'email',
    name: 'Gmail',
    icon: 'Mail',
    color: '#EA4335',
    gradient: 'from-red-500 to-orange-600',
    description: 'Unified Business Email inbox with Google OAuth access',
    connected: false,
    statusOverride: 'NOT CONNECTED',
    lastSynced: 'Disconnected',
    messageCount: 0,
    urgentCount: 0,
    unreadCount: 0,
    accountHandle: undefined,
    capabilities: ['IMAP/SMTP Sync', 'Google OAuth 2.0', 'Thread Summaries', 'Auto Drafting']
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'MessageSquare',
    color: '#25D366',
    gradient: 'from-emerald-500 to-teal-700',
    description: 'Direct customer messaging & business catalog support via Meta Cloud API',
    connected: false,
    statusOverride: 'ACCESS REQUIRED',
    lastSynced: 'Requires Authorization',
    messageCount: 0,
    urgentCount: 0,
    unreadCount: 0,
    accountHandle: 'WhatsApp Business API',
    capabilities: ['Direct Messages', 'Group Chats', 'Media Attachments', 'Catalog Sync']
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'Instagram',
    color: '#E4405F',
    gradient: 'from-pink-500 via-purple-500 to-amber-500',
    description: 'Instagram DMs, post comments & story mentions via Meta Graph API',
    connected: false,
    statusOverride: 'ACCESS REQUIRED',
    lastSynced: 'Requires Authorization',
    messageCount: 0,
    urgentCount: 0,
    unreadCount: 0,
    accountHandle: 'Instagram Graph API',
    capabilities: ['Direct Messages', 'Comment Replies', 'Story Mentions', 'Media Sharing']
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'Facebook',
    color: '#1877F2',
    gradient: 'from-blue-600 to-indigo-700',
    description: 'Facebook Messenger & Business Page inquiries via Meta Graph API',
    connected: false,
    statusOverride: 'ACCESS REQUIRED',
    lastSynced: 'Requires Authorization',
    messageCount: 0,
    urgentCount: 0,
    unreadCount: 0,
    accountHandle: 'Facebook Messenger API',
    capabilities: ['Messenger DMs', 'Page Comments', 'Lead Form Alerts']
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'Music2',
    color: '#000000',
    gradient: 'from-cyan-400 via-slate-900 to-rose-500',
    description: 'TikTok business DMs, video comments & creator sync',
    connected: false,
    statusOverride: 'ACCESS REQUIRED',
    lastSynced: 'Requires Authorization',
    messageCount: 0,
    urgentCount: 0,
    unreadCount: 0,
    accountHandle: 'TikTok Business Open API',
    capabilities: ['Business Messages', 'Video Comments', 'Creator Inbox']
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'Briefcase',
    color: '#0A66C2',
    gradient: 'from-sky-600 to-blue-800',
    description: 'Professional InMail, company page leads & connections',
    connected: false,
    statusOverride: 'ACCESS REQUIRED',
    lastSynced: 'Requires Authorization',
    messageCount: 0,
    urgentCount: 0,
    unreadCount: 0,
    accountHandle: 'LinkedIn Community API',
    capabilities: ['InMail Messages', 'Connection Requests', 'Company Page Lead Gen']
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    icon: 'Calendar',
    color: '#4285F4',
    gradient: 'from-blue-500 to-teal-500',
    description: 'Google Calendar schedule, meeting links & event reminders',
    connected: false,
    statusOverride: 'CONNECTED',
    lastSynced: 'Live Sync',
    messageCount: 0,
    urgentCount: 0,
    unreadCount: 0,
    accountHandle: 'Google Calendar (OAuth 2.0)',
    capabilities: ['Event Sync', 'Meeting Invites', 'Automatic Reminders', 'Schedule Optimization']
  },
  {
    id: 'drive',
    name: 'Google Drive',
    icon: 'HardDrive',
    color: '#0F9D58',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Google Drive cloud document assets & team storage',
    connected: false,
    statusOverride: 'CONNECTED',
    lastSynced: 'Live Sync',
    messageCount: 0,
    urgentCount: 0,
    unreadCount: 0,
    accountHandle: 'Google Drive API v3',
    capabilities: ['File Storage', 'Document Export', 'Workspace Sync']
  },
  {
    id: 'meet',
    name: 'Google Meet',
    icon: 'Video',
    color: '#00897B',
    gradient: 'from-teal-500 to-cyan-600',
    description: 'Video meeting generator & client conference scheduling',
    connected: false,
    statusOverride: 'CONNECTED',
    lastSynced: 'Live Sync',
    messageCount: 0,
    urgentCount: 0,
    unreadCount: 0,
    accountHandle: 'Google Meet API',
    capabilities: ['Video Call Generator', 'Meeting Links', 'Calendar Invite Attachments']
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: 'X',
    color: '#1DA1F2',
    gradient: 'from-slate-800 to-slate-950',
    description: 'Direct Messages, mentions, brand tags & replies',
    connected: false,
    statusOverride: 'ACCESS REQUIRED',
    lastSynced: 'Requires Authorization',
    messageCount: 0,
    urgentCount: 0,
    unreadCount: 0,
    accountHandle: 'X Developer API v2',
    capabilities: ['Direct Messages', 'Public Mentions', 'Thread Monitoring']
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: 'Slack',
    color: '#4A154B',
    gradient: 'from-purple-700 via-fuchsia-800 to-indigo-900',
    description: 'Team channels, client Slack Connect & direct messages',
    connected: false,
    statusOverride: 'ACCESS REQUIRED',
    lastSynced: 'Requires Authorization',
    messageCount: 0,
    urgentCount: 0,
    unreadCount: 0,
    accountHandle: 'Slack Web API',
    capabilities: ['Channel Messages', 'Direct Mentions', 'Slack Connect', 'File Sharing']
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [];

export const DAILY_SPARKS: DailySparkItem[] = [
  { id: 'ds-1', quote: 'BUILD. DREAM. ACHIEVE.', category: 'motivation' },
  { id: 'ds-2', quote: 'LIFE BELONGS TO THOSE WHO PLAN.', category: 'planning' },
  { id: 'ds-3', quote: 'SMALL STEPS. BIG RESULTS.', category: 'growth' },
  { id: 'ds-4', quote: 'YOUR VISION DESERVES ACTION.', category: 'action' },
  { id: 'ds-5', quote: "DON'T JUST DREAM IT. BUILD IT.", category: 'motivation' }
];

export const AI_TOOLS_LIST: AITool[] = [
  {
    id: 'tool-reply',
    name: 'Reply with AI',
    description: 'Generate smart, personalized responses in seconds',
    icon: 'MessageSquare',
    category: 'messaging',
    promptTemplate: 'Draft a professional and empathetic reply to this customer message:',
    inputPlaceholder: 'Paste message or select recent conversation...'
  },
  {
    id: 'tool-summarize',
    name: 'Summarize Chat',
    description: 'Get key action points & decisions from long threads',
    icon: 'FileText',
    category: 'messaging',
    promptTemplate: 'Summarize the key points, action items, and sentiment from this conversation:',
    inputPlaceholder: 'Paste chat log or select thread...'
  },
  {
    id: 'tool-post',
    name: 'Generate Post',
    description: 'Create high-converting social posts for all platforms',
    icon: 'PenTool',
    category: 'content',
    promptTemplate: 'Create an engaging social media post tailored for LinkedIn and Instagram about:',
    inputPlaceholder: 'e.g. Launching our new WIHGO AI feature...'
  },
  {
    id: 'tool-caption',
    name: 'Generate Caption',
    description: 'Catchy hooks, hashtags & captions for Instagram & TikTok',
    icon: 'Sparkles',
    category: 'content',
    promptTemplate: 'Write 3 viral TikTok/Instagram captions with hooks and relevant hashtags for:',
    inputPlaceholder: 'e.g. Behind the scenes of a productive founder day...'
  },
  {
    id: 'tool-improve',
    name: 'Improve Writing',
    description: 'Polish tone, grammar & impact across messages',
    icon: 'Wand2',
    category: 'messaging',
    promptTemplate: 'Improve and polish this message to be clear, elegant, and persuasive:',
    inputPlaceholder: 'Paste your draft here...'
  },
  {
    id: 'tool-email',
    name: 'Email Writer',
    description: 'Craft compelling cold outreach & client follow-ups',
    icon: 'Mail',
    category: 'messaging',
    promptTemplate: 'Write a persuasive business email regarding:',
    inputPlaceholder: 'e.g. Partnership inquiry for Q3 software integration...'
  },
  {
    id: 'tool-followup',
    name: 'Follow-Up Generator',
    description: 'Generate gentle, effective reminders for unreplied leads',
    icon: 'Clock',
    category: 'business',
    promptTemplate: 'Draft a polite and strategic follow-up message for a prospect who hasn\'t responded in 3 days:',
    inputPlaceholder: 'Context about the initial conversation...'
  },
  {
    id: 'tool-analyzer',
    name: 'Message Analyzer',
    description: 'Detect sentiment, intent & urgency in incoming messages',
    icon: 'Activity',
    category: 'business',
    promptTemplate: 'Analyze this customer message for sentiment, urgency rating (1-10), key objections, and recommended next step:',
    inputPlaceholder: 'Paste customer email or message...'
  },
  {
    id: 'tool-ideas',
    name: 'Business Idea Generator',
    description: 'Brainstorm marketing strategies, campaign concepts & tactics',
    icon: 'Lightbulb',
    category: 'business',
    promptTemplate: 'Provide 5 innovative marketing and growth ideas for:',
    inputPlaceholder: 'e.g. Expanding our B2B SaaS reach on LinkedIn and X...'
  },
  {
    id: 'tool-planner',
    name: 'Daily Planner',
    description: 'AI-curated schedule based on your urgent messages & tasks',
    icon: 'Calendar',
    category: 'planning',
    promptTemplate: 'Analyze these tasks and messages to create an optimized hourly focus schedule for today:',
    inputPlaceholder: 'List your priorities or click "Use Current Workspace Data"'
  },
  {
    id: 'tool-meeting',
    name: 'Meeting Summary',
    description: 'Turn raw notes into clean meeting action items',
    icon: 'CheckSquare',
    category: 'planning',
    promptTemplate: 'Format these meeting notes into Executive Summary, Key Decisions, and Assigned Action Items:',
    inputPlaceholder: 'Paste meeting transcript or notes...'
  },
  {
    id: 'tool-hashtags',
    name: 'Content Assistant',
    description: 'Find trending hashtags & optimal posting times',
    icon: 'Slack',
    category: 'content',
    promptTemplate: 'Recommend high-performing hashtag clusters and content hook strategies for:',
    inputPlaceholder: 'e.g. AI tools for entrepreneurs...'
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_REMINDERS: Reminder[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: '',
  name: '',
  email: '',
  avatar: '', // Default to empty string so initials avatar is tested, with photo upload option available
  plan: 'AI Studio Enterprise',
  profileType: 'business',
  companyName: '',
  businessLogo: '',
  phone: '',
  role: 'Founder & Business Architect',
  businessDescription: 'Unified AI-powered communication hub and automation platform for scaling digital businesses.',
  timeZone: 'PST (UTC-8)',
  autoAiRepliesEnabled: false,
  dailySparkEnabled: true,
  emailNotifications: true,
  pushNotifications: true,
  preferredTone: 'professional'
};

export const INITIAL_FOLLOW_UPS: FollowUpItem[] = [];

export const INITIAL_MEMORY_RULES: AIMemoryRule[] = [];

