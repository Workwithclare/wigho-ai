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
    connected: true,
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
    connected: true,
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
    connected: true,
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

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-wa-1',
    platform: 'whatsapp',
    participantName: 'David Chen (Apex Tech)',
    participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    participantHandle: '+1 (555) 234-5678',
    lastMessage: 'Can you send over the updated product catalog and pricing tier for Q3?',
    lastMessageTime: '10:22 AM',
    unreadCount: 1,
    isUrgent: true,
    isImportant: true,
    summary: 'David requested Q3 product catalog and pricing structure for Apex Tech.',
    messages: [
      {
        id: 'm1',
        conversationId: 'conv-wa-1',
        platform: 'whatsapp',
        senderName: 'David Chen',
        content: 'Hi! Following up on our call yesterday regarding the Q3 proposal.',
        timestamp: '10:18 AM',
        isFromUser: false,
        isRead: true
      },
      {
        id: 'm2',
        conversationId: 'conv-wa-1',
        platform: 'whatsapp',
        senderName: 'David Chen',
        content: 'Can you send over the updated product catalog and pricing tier for Q3?',
        timestamp: '10:22 AM',
        isFromUser: false,
        isRead: false,
        isUrgent: true,
        aiSuggestedReply: 'Hi David! Absolutely. I am attaching our updated Q3 catalog and revised pricing tiers. Let me know if you would like to jump on a quick 10-minute sync tomorrow to review!'
      }
    ]
  },
  {
    id: 'conv-ig-1',
    platform: 'instagram',
    participantName: 'Jessica Miller',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    participantHandle: '@jessica_design32',
    lastMessage: 'Hey! I love your latest AI Connect Hub showcase reel 🔥 Are you accepting new partners?',
    lastMessageTime: '10:30 AM',
    unreadCount: 2,
    isUrgent: false,
    isImportant: true,
    summary: 'Jessica expressed interest in partnership after seeing the Connect Hub reel.',
    messages: [
      {
        id: 'm3',
        conversationId: 'conv-ig-1',
        platform: 'instagram',
        senderName: 'Jessica Miller',
        content: 'Hey! I love your latest AI Connect Hub showcase reel 🔥',
        timestamp: '10:28 AM',
        isFromUser: false,
        isRead: true
      },
      {
        id: 'm4',
        conversationId: 'conv-ig-1',
        platform: 'instagram',
        senderName: 'Jessica Miller',
        content: 'Are you accepting new agency partners for Q3?',
        timestamp: '10:30 AM',
        isFromUser: false,
        isRead: false,
        aiSuggestedReply: 'Hi Jessica! Thanks so much for reaching out! Yes, we are accepting new partners for Q3. I would love to send over our partner guide or schedule a brief call. What day works best for you?'
      }
    ]
  },
  {
    id: 'conv-slack-1',
    platform: 'slack',
    participantName: '#marketing-campaigns (Alex Vance)',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    participantHandle: '@alex.vance',
    lastMessage: '@here The new campaign assets for WIHGO launch are ready for final approval.',
    lastMessageTime: '09:45 AM',
    unreadCount: 1,
    isUrgent: true,
    isImportant: true,
    summary: 'Alex posted launch campaign assets requiring urgent review and approval.',
    messages: [
      {
        id: 'm5',
        conversationId: 'conv-slack-1',
        platform: 'slack',
        senderName: 'Alex Vance',
        content: '@here The new campaign assets for WIHGO launch are ready for final approval.',
        timestamp: '09:45 AM',
        isFromUser: false,
        isRead: false,
        isUrgent: true,
        aiSuggestedReply: 'Reviewed the campaign assets! They look crisp and ready for launch. Approved from my side. Let us deploy to social channels!'
      }
    ]
  },
  {
    id: 'conv-email-1',
    platform: 'email',
    participantName: 'Sarah Johnson (Venture Capital)',
    participantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    participantHandle: 'sjohnson@horizonvc.io',
    lastMessage: 'Re: WIHGO AI Partnership & Investment Discussion - Schedule Call',
    lastMessageTime: '08:15 AM',
    unreadCount: 1,
    isUrgent: true,
    isImportant: true,
    summary: 'Sarah Johnson from Horizon VC requested a meeting to discuss investment opportunities.',
    messages: [
      {
        id: 'm6',
        conversationId: 'conv-email-1',
        platform: 'email',
        senderName: 'Sarah Johnson',
        content: 'Dear WIHGO Team,\n\nWe have been following WIHGO AI Connect Hub closely. Our investment thesis aligns strongly with unified business communication tools. Would you have 20 minutes this Thursday for an introductory call?\n\nBest regards,\nSarah Johnson',
        timestamp: '08:15 AM',
        isFromUser: false,
        isRead: false,
        isUrgent: true,
        aiSuggestedReply: 'Dear Sarah,\n\nThank you for reaching out! We would be delighted to connect and discuss WIHGO AI\'s growth trajectory. Thursday afternoon at 2 PM EST works great. I will send over a Google Calendar invitation shortly.'
      }
    ]
  },
  {
    id: 'conv-tiktok-1',
    platform: 'tiktok',
    participantName: 'Markus (Creator)',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    participantHandle: '@markus_07',
    lastMessage: 'Thanks! That video workflow breakdown helped a lot 🙌',
    lastMessageTime: '09:12 AM',
    unreadCount: 0,
    messages: [
      {
        id: 'm7',
        conversationId: 'conv-tiktok-1',
        platform: 'tiktok',
        senderName: 'Markus',
        content: 'Thanks! That video workflow breakdown helped a lot 🙌',
        timestamp: '09:12 AM',
        isFromUser: false,
        isRead: true
      }
    ]
  },
  {
    id: 'conv-x-1',
    platform: 'x',
    participantName: 'John Doe (@john_doe)',
    participantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    participantHandle: '@john_doe',
    lastMessage: 'Mentioned you in a post: "WIHGO AI is transforming how we handle cross-platform client inquiries!"',
    lastMessageTime: '09:20 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'm8',
        conversationId: 'conv-x-1',
        platform: 'x',
        senderName: 'John Doe',
        content: 'Mentioned you in a post: "WIHGO AI is transforming how we handle cross-platform client inquiries!"',
        timestamp: '09:20 AM',
        isFromUser: false,
        isRead: false
      }
    ]
  },
  {
    id: 'conv-linkedin-1',
    platform: 'linkedin',
    participantName: 'Elena Rostova',
    participantAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    participantHandle: 'elena-rostova-tech',
    lastMessage: 'InMail: Interested in integrating WIHGO AI Connect Hub into our Enterprise stack.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 'm9',
        conversationId: 'conv-linkedin-1',
        platform: 'linkedin',
        senderName: 'Elena Rostova',
        content: 'Hello! I lead Operations at GlobalFlow. We manage 10+ social & messaging platforms and need a unified hub like WIHGO AI.',
        timestamp: 'Yesterday',
        isFromUser: false,
        isRead: true
      }
    ]
  },
  {
    id: 'conv-fb-1',
    platform: 'facebook',
    participantName: 'Sarah Johnson (FB Lead)',
    participantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    participantHandle: 'Sarah J.',
    lastMessage: 'Hey, is the business consulting package still available for booking?',
    lastMessageTime: '08:15 AM',
    unreadCount: 0,
    messages: [
      {
        id: 'm10',
        conversationId: 'conv-fb-1',
        platform: 'facebook',
        senderName: 'Sarah Johnson',
        content: 'Hey, is the business consulting package still available for booking?',
        timestamp: '08:15 AM',
        isFromUser: false,
        isRead: true
      }
    ]
  }
];

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

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Horizon VC Intro Call',
    description: 'Discussion with Sarah Johnson regarding WIHGO AI seed investment round.',
    type: 'meeting',
    platform: 'calendar',
    startTime: '2026-08-09T14:00:00',
    endTime: '2026-08-09T14:30:00',
    locationOrUrl: 'https://meet.google.com/wihgo-vc-demo'
  },
  {
    id: 'ev-2',
    title: 'Post Product Reel on Instagram & TikTok',
    description: 'Scheduled WIHGO AI Connect Hub video showcase release.',
    type: 'scheduled_content',
    platform: 'instagram',
    startTime: '2026-08-09T16:30:00',
    completed: false
  },
  {
    id: 'ev-3',
    title: 'Send Q3 Catalog to David Chen (Apex Tech)',
    description: 'Follow-up via WhatsApp with updated pricing sheets.',
    type: 'followup',
    platform: 'whatsapp',
    startTime: '2026-08-09T11:00:00',
    completed: false
  },
  {
    id: 'ev-4',
    title: '#marketing-campaigns Review Sync',
    description: 'Review Alex Vance\'s campaign assets in Hash.',
    type: 'meeting',
    platform: 'slack',
    startTime: '2026-08-09T15:00:00',
    locationOrUrl: 'Slack Huddle #marketing-campaigns'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Reply to David Chen with Q3 Catalog PDF',
    description: 'Check Apex Tech pricing adjustments before sending on WhatsApp.',
    platform: 'whatsapp',
    priority: 'high',
    dueDate: '2026-08-09',
    completed: false,
    hasReminder: true,
    reminderTime: '11:00 AM',
    category: 'Sales'
  },
  {
    id: 'task-2',
    title: 'Approve Alex Vance\'s launch creative assets in Hash',
    description: 'Ensure brand colors and logos match WIHGO guidelines.',
    platform: 'slack',
    priority: 'high',
    dueDate: '2026-08-09',
    completed: false,
    hasReminder: true,
    reminderTime: '12:00 PM',
    category: 'Marketing'
  },
  {
    id: 'task-3',
    title: 'Confirm Google Calendar invite with Sarah Johnson (Horizon VC)',
    description: 'Send meeting link for Thursday 2 PM EST.',
    platform: 'email',
    priority: 'high',
    dueDate: '2026-08-09',
    completed: false,
    category: 'Investor Relations'
  },
  {
    id: 'task-4',
    title: 'Schedule Q3 Content Batch across Instagram & LinkedIn',
    description: 'Use WIHGO AI Content Assistant to generate captions.',
    platform: 'instagram',
    priority: 'medium',
    dueDate: '2026-08-10',
    completed: false,
    category: 'Social Media'
  }
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Call David Chen at 11:00 AM regarding Apex Tech contract',
    dateTime: '2026-08-09T11:00:00',
    priority: 'high',
    repeat: 'none',
    completed: false,
    platform: 'whatsapp'
  },
  {
    id: 'rem-2',
    title: 'Check Instagram DM inquiries before end of day',
    dateTime: '2026-08-09T17:00:00',
    priority: 'medium',
    repeat: 'daily',
    completed: false,
    platform: 'instagram'
  },
  {
    id: 'rem-3',
    title: 'Slack team check-in on sprint deliverables',
    dateTime: '2026-08-09T13:30:00',
    priority: 'medium',
    repeat: 'weekly',
    completed: false,
    platform: 'slack'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    platform: 'whatsapp',
    title: 'WhatsApp Message',
    message: 'New urgent message from David Chen (Apex Tech).',
    timestamp: '2m ago',
    read: false,
    type: 'message'
  },
  {
    id: 'notif-2',
    platform: 'slack',
    title: 'Slack Mention',
    message: 'You were mentioned by Alex Vance in #marketing-campaigns.',
    timestamp: '15m ago',
    read: false,
    type: 'mention'
  },
  {
    id: 'notif-3',
    platform: 'calendar',
    title: 'Calendar Reminder',
    message: 'Upcoming meeting: Horizon VC Intro Call in 30 minutes.',
    timestamp: '25m ago',
    read: false,
    type: 'meeting'
  },
  {
    id: 'notif-4',
    platform: 'instagram',
    title: 'Instagram Partnership Inquiry',
    message: 'Jessica Miller sent a DM regarding Q3 agency partner guide.',
    timestamp: '1h ago',
    read: true,
    type: 'message'
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-101',
  name: 'Clare Chioma',
  email: 'workwithclare1@gmail.com',
  avatar: '', // Default to empty string so initials avatar is tested, with photo upload option available
  plan: 'AI Studio Enterprise',
  profileType: 'business',
  companyName: 'WIHGO Global',
  businessLogo: '',
  phone: '+1 (555) 234-5678',
  role: 'Founder & Business Architect',
  businessDescription: 'Unified AI-powered communication hub and automation platform for scaling digital businesses.',
  timeZone: 'PST (UTC-8)',
  autoAiRepliesEnabled: false,
  dailySparkEnabled: true,
  emailNotifications: true,
  pushNotifications: true,
  preferredTone: 'professional'
};

export const INITIAL_FOLLOW_UPS: FollowUpItem[] = [
  {
    id: 'fup-1',
    contactName: 'David Chen',
    contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    platform: 'whatsapp',
    lastContact: 'Yesterday, 4:30 PM',
    followUpDate: 'Today, 2:00 PM',
    status: 'due_today',
    topic: 'Apex Tech Enterprise License Contract'
  },
  {
    id: 'fup-2',
    contactName: 'Sarah Johnson',
    contactAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    platform: 'email',
    lastContact: '2 days ago',
    followUpDate: 'Today, 5:00 PM',
    status: 'due_today',
    topic: 'Horizon VC Q3 Funding Terms'
  },
  {
    id: 'fup-3',
    contactName: 'Jessica Miller',
    contactAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    platform: 'instagram',
    lastContact: '3 days ago',
    followUpDate: 'Tomorrow',
    status: 'pending',
    topic: 'Agency Partner Collaboration'
  }
];

export const INITIAL_MEMORY_RULES: AIMemoryRule[] = [
  {
    id: 'mem-1',
    title: 'Customer Response Tone',
    rule: 'Always maintain a warm, highly professional and clear response tone for all incoming inquiries.',
    category: 'tone',
    active: true
  },
  {
    id: 'mem-2',
    title: 'Lead Follow-Up Cadence',
    rule: 'Follow up with potential leads within 24 to 48 hours if no response is received.',
    category: 'workflow',
    active: true
  },
  {
    id: 'mem-3',
    title: 'Discount Authorization Policy',
    rule: 'Do not offer custom pricing discounts without user approval.',
    category: 'policy',
    active: true
  },
  {
    id: 'mem-4',
    title: 'VIP Contacts Protocol',
    rule: 'Mark Horizon VC, Apex Tech, and Creative Co as VIP priority contacts across all channels.',
    category: 'vip',
    active: true
  }
];

