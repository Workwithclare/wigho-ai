export type PlatformId = 
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'linkedin'
  | 'x'
  | 'slack'
  | 'email'
  | 'calendar'
  | 'drive'
  | 'meet';

export type NavViewId = 
  | 'home'
  | 'dashboard'
  | 'business-hub'
  | 'business'
  | 'inbox'
  | 'connect'
  | 'aitools'
  | 'ai-tools'
  | 'assistant'
  | 'ai-assistant'
  | 'business-assistant'
  | 'social'
  | 'social-hub'
  | 'create'
  | 'content-creation'
  | 'analytics'
  | 'connections'
  | 'calendar'
  | 'drive'
  | 'meet'
  | 'tasks'
  | 'reminders'
  | 'myday'
  | 'my-day'
  | 'profile'
  | 'important'
  | 'notifications'
  | 'my-connections'
  | 'followups'
  | 'business-brain'
  | 'business-pulse'
  | 'settings'
  | 'subscription'
  | 'workspace-whatsapp'
  | 'workspace-instagram'
  | 'workspace-facebook'
  | 'workspace-tiktok'
  | 'workspace-linkedin'
  | 'workspace-x'
  | 'workspace-slack'
  | 'workspace-email';

export interface PlatformInfo {
  id: PlatformId;
  name: string;
  icon: string;
  color: string; // Tailwind color or hex
  gradient: string; // CSS gradient class
  description: string;
  connected: boolean;
  statusOverride?: 'NOT CONNECTED' | 'ACCESS REQUIRED' | 'CONNECTING' | 'CONNECTED' | 'RECONNECT REQUIRED' | 'ERROR';
  lastSynced?: string;
  messageCount: number;
  urgentCount: number;
  unreadCount: number;
  accountHandle?: string;
  category?: string;
  capabilities: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  platform: PlatformId;
  senderName: string;
  senderAvatar?: string;
  senderHandle?: string;
  content: string;
  timestamp: string;
  isFromUser: boolean;
  isRead: boolean;
  isUrgent?: boolean;
  isImportant?: boolean;
  aiSuggestedReply?: string;
  sentiment?: 'positive' | 'neutral' | 'urgent' | 'negative';
}

export interface Conversation {
  id: string;
  platform: PlatformId;
  participantName: string;
  participantAvatar?: string;
  participantHandle?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  senderName?: string;
  isUrgent?: boolean;
  isImportant?: boolean;
  isArchived?: boolean;
  folder?: 'inbox' | 'unread' | 'important' | 'sent' | 'archived';
  status?: 'active' | 'needs_reply' | 'urgent' | 'archived' | 'resolved';
  messages: Message[];
  summary?: string;
}

export type AIReplyTone = 'professional' | 'friendly' | 'short' | 'persuasive' | 'custom';

export interface ConnectorState {
  platformId: PlatformId;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  tokenExpiresAt?: string;
  permissionsGranted: string[];
  syncFrequencyMinutes: number;
  lastErrorMessage?: string;
  accountName?: string;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'messaging' | 'content' | 'planning' | 'business';
  promptTemplate: string;
  inputPlaceholder: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: 'meeting' | 'event' | 'task' | 'reminder' | 'followup' | 'scheduled_content';
  platform?: PlatformId;
  startTime: string; // ISO or string
  time?: string;
  date?: string;
  endTime?: string;
  locationOrUrl?: string;
  completed?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  platform?: PlatformId;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  tag?: string;
  hasReminder?: boolean;
  reminderTime?: string;
  category?: string;
}

export interface Reminder {
  id: string;
  title: string;
  dateTime: string;
  priority: 'high' | 'medium' | 'low';
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  platform?: PlatformId;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  user_id?: string;
  platform: PlatformId | 'system' | 'profile' | 'ai' | string;
  source?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  type: 'message' | 'mention' | 'meeting' | 'task' | 'system' | 'sync' | 'connector' | 'profile' | 'ai' | 'invite' | string;
  created_at?: string;
  read_at?: string;
}

export interface ActivityItem {
  id: string;
  userId?: string;
  type: 'connector' | 'profile' | 'ai' | 'task' | 'meeting' | 'system' | string;
  title: string;
  description: string;
  platform?: PlatformId | 'system' | 'profile' | 'ai' | string;
  status?: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  profileType: 'personal' | 'business';
  companyName?: string;
  businessLogo?: string;
  phone?: string;
  role?: string;
  businessDescription?: string;
  timeZone?: string;
  autoAiRepliesEnabled: boolean;
  dailySparkEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  preferredTone: AIReplyTone;
}

export interface DailySparkItem {
  id: string;
  quote: string;
  author?: string;
  category: 'motivation' | 'focus' | 'growth' | 'action' | 'planning';
}

export interface FollowUpItem {
  id: string;
  contactName: string;
  contactAvatar?: string;
  platform: PlatformId;
  lastContact: string;
  followUpDate: string;
  status: 'pending' | 'due_today' | 'completed' | 'overdue';
  topic: string;
}

export interface AIMemoryRule {
  id: string;
  title: string;
  rule: string;
  category: 'tone' | 'workflow' | 'policy' | 'vip';
  active: boolean;
}

// -------------------------------------------------------------
// WIHGO AI — INTELLIGENCE LAYER CORE DATA MODELS
// -------------------------------------------------------------

export type BusinessEntityType = 
  | 'customer' 
  | 'lead' 
  | 'conversation' 
  | 'company' 
  | 'task' 
  | 'meeting' 
  | 'decision' 
  | 'commitment' 
  | 'opportunity';

export interface BusinessMemoryItem {
  id: string;
  entityType: BusinessEntityType;
  entityName: string;
  contactHandle?: string;
  platform?: PlatformId | 'system' | 'general';
  title: string;
  detail: string;
  date: string;
  tags: string[];
  sentiment?: 'positive' | 'neutral' | 'urgent' | 'caution';
  status?: 'active' | 'pending' | 'resolved' | 'archived';
  confidence?: number;
  extractedFrom?: string; // e.g. "Instagram DM", "WhatsApp conversation"
  relatedCustomer?: string;
  amountOrValue?: string;
  dueDateOrTime?: string;
  actionRequired?: boolean;
}

export interface Commitment {
  id: string;
  whoPromised: string; // e.g., "Clare (WIHGO Owner)"
  toWhom: string; // e.g., "John Doe (Acme Corp)"
  promiseText: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'fulfilled' | 'overdue';
  platform?: PlatformId;
  conversationId?: string;
  notes?: string;
}

export interface ContinuityContext {
  id: string;
  customerName: string;
  handle?: string;
  avatar?: string;
  platform: PlatformId;
  companyName?: string;
  previousInteraction: string;
  previousResponse: string;
  currentStatus: string;
  recommendedNextAction: string;
  commitments: Commitment[];
  responsiblePerson: string;
  keyPreferences?: string[];
  lastInteractionDate: string;
  intentCategory?: 'pricing_inquiry' | 'high_purchase_intent' | 'support_request' | 'partnership' | 'general';
}

export type AttentionCategory = 'urgent' | 'decisions' | 'followups' | 'opportunities' | 'information';

export interface AttentionItem {
  id: string;
  category: AttentionCategory;
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  explanation: string; // Explicit reason WHY prioritized
  sourcePlatform: PlatformId | 'system' | 'calendar' | 'email';
  entityName: string;
  entityAvatar?: string;
  timestamp: string;
  timeAgo?: string;
  actionLabel: string; // e.g., "Open conversation", "View lead", "Review"
  targetTab?: string;
  targetPlatform?: PlatformId;
  targetId?: string;
  resolved?: boolean;
  metadata?: Record<string, any>;
}

export interface ConversationAIInsight {
  intent: string;
  intentScore: number;
  customerMood: 'ready_to_buy' | 'exploring' | 'frustrated' | 'satisfied' | 'neutral';
  keyNeed: string;
  suggestedDraftReply: string;
  suggestedAction: string;
  extractedTasks: string[];
  extractedCommitments: string[];
}

export interface BusinessInsightItem {
  id: string;
  category: 'buying_intent' | 'sla_risk' | 'recurring_inquiry' | 'relationship_opportunity' | 'bottleneck' | 'trend';
  title: string;
  explanation: string;
  sourceContext: string;
  sourcePlatform?: PlatformId | 'multi-platform' | 'email' | 'calendar';
  recommendedAction?: string;
  severity: 'high' | 'medium' | 'info';
  impactMetric?: string;
  entityName?: string;
  targetTab?: string;
  targetPlatform?: PlatformId;
  targetId?: string;
}

export interface BusinessContextRelation {
  id: string;
  customerName: string;
  companyName: string;
  handle?: string;
  conversations: Array<{
    id: string;
    platform: PlatformId;
    summary: string;
    date: string;
  }>;
  emails: Array<{
    id: string;
    subject: string;
    snippet: string;
    date: string;
  }>;
  meetings: Array<{
    id: string;
    title: string;
    date: string;
    status: 'scheduled' | 'completed';
  }>;
  tasks: Array<{
    id: string;
    title: string;
    status: 'pending' | 'completed';
  }>;
  decisions: Array<{
    id: string;
    decisionText: string;
    date: string;
  }>;
  commitments: Array<{
    id: string;
    promiseText: string;
    dueDate: string;
    status: string;
  }>;
  currentStatus: string;
  recommendedAction: string;
}

