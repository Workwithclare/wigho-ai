"use client";

import React, { useState, useMemo } from 'react';
import {
  Link as LinkIcon,
  ShieldCheck,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Bot,
  Zap,
  RefreshCw,
  ExternalLink,
  Sliders,
  Plus,
  MessageSquare,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail,
  Calendar as CalendarIcon,
  HardDrive,
  Video,
  CheckSquare,
  Building2,
  CreditCard,
  ShoppingBag,
  DollarSign,
  Users,
  FileText,
  Table,
  Headphones,
  TrendingUp,
  Brain,
  Share2,
  ArrowRight,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { PlatformInfo, PlatformId, UserProfile } from '../../../lib/wihgo/types';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { PlatformConnectorModal, ConnectorStatusType } from './PlatformConnectorModal';
import { GoogleWorkspaceGroupModal } from './GoogleWorkspaceGroupModal';
import { createNotificationAndActivity } from '../../../lib/wihgo/demoBackend';

interface BusinessConnectHubViewProps {
  platforms: PlatformInfo[];
  user?: UserProfile;
  onToggleConnection?: (platformId: PlatformId) => void;
  onOpenWorkspace?: (platformId: PlatformId) => void;
  onStatusChange?: (platformId: PlatformId, newStatus: ConnectorStatusType) => void;
  onNavigateTab?: (tab: string) => void;
  openAiAssistant?: () => void;
}

export type ConnectorCategory = 
  | 'all'
  | 'communication'
  | 'social'
  | 'productivity'
  | 'crm'
  | 'marketing'
  | 'business-tools'
  | 'email'
  | 'calendar'
  | 'customer-support'
  | 'finance'
  | 'sales';

export type IntegrationTab = 'all' | 'connected' | 'available';

interface MarketplaceApp {
  id: string;
  platformId?: PlatformId;
  name: string;
  category: ConnectorCategory;
  categoryLabel: string;
  description: string;
  iconType: string;
  iconBg: string;
  connected: boolean;
  status: 'connected' | 'available' | 'coming-soon';
  statusOverride?: string;
  lastSynced?: string;
  officialApi: string;
  capabilities: string[];
  permissions: string[];
  enables: string[];
}

export const BusinessConnectHubView: React.FC<BusinessConnectHubViewProps> = ({
  platforms,
  user,
  onToggleConnection,
  onOpenWorkspace,
  onStatusChange,
  onNavigateTab,
  openAiAssistant
}) => {
  const [activeTab, setActiveTab] = useState<IntegrationTab>('all');
  const [selectedCategory, setSelectedCategory] = useState<ConnectorCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAppForModal, setSelectedAppForModal] = useState<MarketplaceApp | null>(null);
  const [isGoogleWorkspaceModalOpen, setIsGoogleWorkspaceModalOpen] = useState<boolean>(false);
  const [customConnectedState, setCustomConnectedState] = useState<Record<string, boolean>>({});

  // Request Integration modal state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [requestAppName, setRequestAppName] = useState<string>('');
  const [requestCategory, setRequestCategory] = useState<string>('CRM / Sales');
  const [requestNotes, setRequestNotes] = useState<string>('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState<boolean>(false);
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false);

  const handleSubmitIntegrationRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestAppName.trim()) return;

    setIsSubmittingRequest(true);
    try {
      if (user?.id && user.id !== 'default') {
        await createNotificationAndActivity(user.id, {
          title: `Integration Requested: ${requestAppName.trim()}`,
          message: `Your request for ${requestAppName.trim()} (${requestCategory}) has been logged with the engineering team.`,
          platform: 'email',
          type: 'connector',
          status: 'info'
        });
      }
      setRequestSuccess(true);
      setTimeout(() => {
        setIsRequestModalOpen(false);
        setRequestSuccess(false);
        setRequestAppName('');
        setRequestNotes('');
      }, 1800);
    } catch {
      setRequestSuccess(true);
      setTimeout(() => {
        setIsRequestModalOpen(false);
        setRequestSuccess(false);
      }, 1500);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // Synchronize base platforms with full enterprise catalog
  const allMarketplaceApps: MarketplaceApp[] = useMemo(() => {
    const isPlatformConnected = (id: string, _def: boolean = false) => {
      const match = platforms.find(p => p.id === id);
      if (match) return match.connected;
      return Boolean(customConnectedState[id]);
    };

    return [
      // Communication
      {
        id: 'whatsapp',
        platformId: 'whatsapp',
        name: 'WhatsApp Business',
        category: 'communication',
        categoryLabel: 'Communication',
        description: 'Official WhatsApp Business Cloud API for client messaging, lead capture, and customer support.',
        iconType: 'whatsapp',
        iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        connected: isPlatformConnected('whatsapp', false),
        status: isPlatformConnected('whatsapp', false) ? 'connected' : 'available',
        lastSynced: 'Real-time Webhook',
        officialApi: 'Meta Graph API v20.0',
        capabilities: ['Two-way Direct Chat', 'Broadcast Messages', 'AI Auto-Replies', 'Media Sync'],
        permissions: ['whatsapp_business_messaging', 'whatsapp_business_management'],
        enables: ['Direct client messaging from WIHGO Inbox', 'AI-generated quick replies', 'Customer inquiry tracking']
      },
      {
        id: 'email',
        platformId: 'email',
        name: 'Gmail',
        category: 'email',
        categoryLabel: 'Email',
        description: 'Google Workspace Gmail API synchronization for client communications and automated thread triage.',
        iconType: 'gmail',
        iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        connected: isPlatformConnected('email', false),
        status: isPlatformConnected('email', false) ? 'connected' : 'available',
        lastSynced: isPlatformConnected('email', false) ? 'Live Sync' : 'Not connected',
        officialApi: 'Google Gmail REST API v1',
        capabilities: ['Read/Send Mail', 'Label Management', 'Draft Creation', 'AI Summaries'],
        permissions: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'],
        enables: ['Unified client mailbox triage', 'AI email draft creation', 'Cross-platform customer history']
      },
      {
        id: 'slack',
        platformId: 'slack',
        name: 'Slack',
        category: 'communication',
        categoryLabel: 'Communication',
        description: 'Slack Workspace Bot & Channel Integration for internal team notifications and client guest channels.',
        iconType: 'slack',
        iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        connected: isPlatformConnected('slack', false),
        status: isPlatformConnected('slack', false) ? 'connected' : 'available',
        lastSynced: isPlatformConnected('slack', false) ? '5 mins ago' : 'Not connected',
        officialApi: 'Slack Web API & Events API',
        capabilities: ['Channels & DMs', 'Thread Sync', 'Slash Commands', 'Alert Broadcasts'],
        permissions: ['channels:read', 'chat:write', 'users:read'],
        enables: ['Receive team alerts inside WIHGO', 'Forward customer requests to Slack channels']
      },
      {
        id: 'teams',
        name: 'Microsoft Teams',
        category: 'communication',
        categoryLabel: 'Communication',
        description: 'Microsoft 365 Teams channel integration for enterprise collaboration and client meetings.',
        iconType: 'teams',
        iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        connected: isPlatformConnected('teams', false),
        status: isPlatformConnected('teams', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Microsoft Graph API v1.0',
        capabilities: ['Channel Messages', 'Meeting Scheduling', 'Activity Feeds'],
        permissions: ['Chat.ReadWrite', 'User.Read', 'Calendars.ReadWrite'],
        enables: ['Bridge enterprise client discussions into WIHGO central hub']
      },

      // Social
      {
        id: 'instagram',
        platformId: 'instagram',
        name: 'Instagram Direct',
        category: 'social',
        categoryLabel: 'Social',
        description: 'Instagram Business Direct Messaging, story mentions, and customer inquiries.',
        iconType: 'instagram',
        iconBg: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
        connected: isPlatformConnected('instagram', false),
        status: isPlatformConnected('instagram', false) ? 'connected' : 'available',
        lastSynced: isPlatformConnected('instagram', false) ? 'Real-time Webhook' : 'Not connected',
        officialApi: 'Instagram Graph API v20.0',
        capabilities: ['Direct DMs', 'Story Replies', 'Lead Engagement', 'AI Smart Replies'],
        permissions: ['instagram_basic', 'instagram_manage_messages'],
        enables: ['Consolidated customer DM triage', 'Fast AI response generation', 'Lead tracking']
      },
      {
        id: 'tiktok',
        platformId: 'tiktok',
        name: 'TikTok Business',
        category: 'social',
        categoryLabel: 'Social',
        description: 'TikTok Commercial Content API & Direct Message Management for creator and business accounts.',
        iconType: 'tiktok',
        iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        connected: isPlatformConnected('tiktok', false),
        status: isPlatformConnected('tiktok', false) ? 'connected' : 'available',
        lastSynced: isPlatformConnected('tiktok', false) ? '10 mins ago' : 'Not connected',
        officialApi: 'TikTok for Business API',
        capabilities: ['Direct Inquiries', 'Comment Management', 'Engagement Analytics'],
        permissions: ['user.info.basic', 'video.list', 'comment.list'],
        enables: ['Unified social lead processing', 'Audience engagement monitoring']
      },
      {
        id: 'linkedin',
        platformId: 'linkedin',
        name: 'LinkedIn Company',
        category: 'social',
        categoryLabel: 'Social',
        description: 'LinkedIn Page & Professional InMail messaging for B2B client acquisition and outreach.',
        iconType: 'linkedin',
        iconBg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        connected: isPlatformConnected('linkedin', false),
        status: isPlatformConnected('linkedin', false) ? 'connected' : 'available',
        lastSynced: isPlatformConnected('linkedin', false) ? '15 mins ago' : 'Not connected',
        officialApi: 'LinkedIn REST API v2',
        capabilities: ['InMail Management', 'Page Analytics', 'B2B Lead Tracking'],
        permissions: ['r_liteprofile', 'w_member_social', 'r_organization_social'],
        enables: ['B2B client conversation aggregation', 'Professional outreach follow-up']
      },
      {
        id: 'facebook',
        platformId: 'facebook',
        name: 'Facebook Page',
        category: 'social',
        categoryLabel: 'Social',
        description: 'Facebook Page Messenger, post comments, and Meta Business customer lead forms.',
        iconType: 'facebook',
        iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        connected: isPlatformConnected('facebook', false),
        status: isPlatformConnected('facebook', false) ? 'connected' : 'available',
        lastSynced: isPlatformConnected('facebook', false) ? 'Live Sync' : 'Not connected',
        officialApi: 'Meta Graph API v20.0',
        capabilities: ['Page Messenger', 'Lead Ads Sync', 'Comment Moderation'],
        permissions: ['pages_show_list', 'pages_messaging', 'pages_read_engagement'],
        enables: ['Centralized customer inquiry handling across Facebook & Instagram']
      },

      // Google Workspace Suite Unified Connector
      {
        id: 'google_workspace',
        name: 'Google Workspace',
        category: 'productivity',
        categoryLabel: 'Productivity',
        description: 'Unified Google Workspace Suite: Gmail, Calendar, Meet, Drive, Docs, Sheets, Slides, & Forms.',
        iconType: 'google_workspace',
        iconBg: 'bg-gradient-to-tr from-blue-600/30 via-teal-500/30 to-emerald-500/30 text-teal-300 border-teal-500/40',
        connected: isPlatformConnected('email', false) || isPlatformConnected('calendar', false),
        status: (isPlatformConnected('email', false) || isPlatformConnected('calendar', false)) ? 'connected' : 'available',
        lastSynced: (isPlatformConnected('email', false) || isPlatformConnected('calendar', false)) ? 'Enterprise Suite Active' : 'Not connected',
        officialApi: 'Google Cloud Platform OAuth 2.0',
        capabilities: ['Gmail', 'Google Calendar', 'Google Meet', 'Google Drive', 'Docs & Sheets Sync', 'Forms Integration'],
        permissions: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/drive.readonly'],
        enables: ['Unified Google Workspace suite management across all business functions']
      },

      // Productivity & Calendar
      {
        id: 'calendar',
        platformId: 'calendar',
        name: 'Google Calendar',
        category: 'calendar',
        categoryLabel: 'Calendar',
        description: 'Google Calendar scheduling, client meeting coordination, and AI appointment buffer management.',
        iconType: 'calendar',
        iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
        connected: isPlatformConnected('calendar', false),
        status: isPlatformConnected('calendar', false) ? 'connected' : 'available',
        lastSynced: isPlatformConnected('calendar', false) ? 'Real-time Sync' : 'Not connected',
        officialApi: 'Google Calendar API v3',
        capabilities: ['Event Scheduling', 'Free/Busy Lookup', 'AI Meeting Summaries'],
        permissions: ['https://www.googleapis.com/auth/calendar.events'],
        enables: ['Automated appointment booking from chat', 'Daily agenda visualization']
      },
      {
        id: 'drive',
        platformId: 'drive',
        name: 'Google Drive',
        category: 'productivity',
        categoryLabel: 'Productivity',
        description: 'Google Drive cloud storage synchronization for business proposals, contracts, and shared assets.',
        iconType: 'drive',
        iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        connected: isPlatformConnected('drive', false),
        status: isPlatformConnected('drive', false) ? 'connected' : 'available',
        lastSynced: isPlatformConnected('drive', false) ? 'Live' : 'Not connected',
        officialApi: 'Google Drive REST API v3',
        capabilities: ['File Search', 'Asset Attachment', 'Document Indexing'],
        permissions: ['https://www.googleapis.com/auth/drive.readonly'],
        enables: ['Instant file attachment in chats', 'AI retrieval of business context documents']
      },
      {
        id: 'meet',
        platformId: 'meet',
        name: 'Google Meet',
        category: 'productivity',
        categoryLabel: 'Productivity',
        description: 'Google Meet video conferencing link generator and client meeting room coordination.',
        iconType: 'meet',
        iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        connected: isPlatformConnected('meet', false),
        status: isPlatformConnected('meet', false) ? 'connected' : 'available',
        lastSynced: isPlatformConnected('meet', false) ? 'Active' : 'Not connected',
        officialApi: 'Google Meet REST API',
        capabilities: ['One-click Meet Links', 'Meeting Room Provisioning'],
        permissions: ['https://www.googleapis.com/auth/meetings.space.created'],
        enables: ['Generate instant video meeting links directly inside conversations']
      },
      {
        id: 'gdocs',
        name: 'Google Docs',
        category: 'productivity',
        categoryLabel: 'Productivity',
        description: 'Generate client proposals, quotes, and meeting minutes directly in Google Docs with AI assistance.',
        iconType: 'gdocs',
        iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        connected: isPlatformConnected('gdocs', false),
        status: isPlatformConnected('gdocs', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Google Docs API v1',
        capabilities: ['Document Generation', 'Template Merging', 'Proposal Export'],
        permissions: ['https://www.googleapis.com/auth/documents'],
        enables: ['Export AI meeting summaries and quotes into styled Google Docs']
      },
      {
        id: 'gsheets',
        name: 'Google Sheets',
        category: 'productivity',
        categoryLabel: 'Productivity',
        description: 'Automate sales lead exports, invoice logs, and customer records directly into Google Sheets.',
        iconType: 'gsheets',
        iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        connected: isPlatformConnected('gsheets', false),
        status: isPlatformConnected('gsheets', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Google Sheets API v4',
        capabilities: ['Row Append', 'Lead Database Sync', 'Revenue Tracking'],
        permissions: ['https://www.googleapis.com/auth/spreadsheets'],
        enables: ['Automated customer data logging into your team spreadsheets']
      },
      {
        id: 'notion',
        name: 'Notion',
        category: 'productivity',
        categoryLabel: 'Productivity',
        description: 'Sync customer CRM tables, project roadmaps, and business knowledge databases with Notion.',
        iconType: 'notion',
        iconBg: 'bg-slate-700/40 text-slate-200 border-slate-600',
        connected: isPlatformConnected('notion', false),
        status: isPlatformConnected('notion', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Notion API v1',
        capabilities: ['Database Querying', 'Page Creation', 'Task Synchronization'],
        permissions: ['read_content', 'update_content', 'insert_content'],
        enables: ['Bi-directional task and CRM synchronization with your Notion workspace']
      },

      // CRM & Sales
      {
        id: 'hubspot',
        name: 'HubSpot CRM',
        category: 'crm',
        categoryLabel: 'CRM',
        description: 'Synchronize contact lifecycle stages, deal stages, and customer communication timelines with HubSpot.',
        iconType: 'hubspot',
        iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        connected: isPlatformConnected('hubspot', false),
        status: isPlatformConnected('hubspot', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'HubSpot CRM API v3',
        capabilities: ['Contact Sync', 'Deal Pipeline', 'Engagement Timeline'],
        permissions: ['crm.objects.contacts.read', 'crm.objects.deals.read'],
        enables: ['Automatically log client chats into HubSpot contact records']
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        category: 'crm',
        categoryLabel: 'CRM',
        description: 'Enterprise Salesforce CRM integration for enterprise lead routing and account management.',
        iconType: 'salesforce',
        iconBg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        connected: isPlatformConnected('salesforce', false),
        status: isPlatformConnected('salesforce', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Salesforce REST API v58.0',
        capabilities: ['Lead Management', 'Opportunity Tracking', 'Case Routing'],
        permissions: ['api', 'refresh_token', 'offline_access'],
        enables: ['Enterprise customer record unification and CRM automation']
      },
      {
        id: 'zoho',
        name: 'Zoho CRM',
        category: 'crm',
        categoryLabel: 'CRM',
        description: 'Sync leads, accounts, and deal status from customer conversations into Zoho CRM pipelines.',
        iconType: 'zoho',
        iconBg: 'bg-red-500/20 text-red-400 border-red-500/30',
        connected: isPlatformConnected('zoho', false),
        status: isPlatformConnected('zoho', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Zoho CRM API v2',
        capabilities: ['Lead Creation', 'Contact Updates', 'Task Assignment'],
        permissions: ['ZohoCRM.modules.ALL'],
        enables: ['Seamless lead intake from WhatsApp and Instagram directly into Zoho CRM']
      },

      // Marketing
      {
        id: 'mailchimp',
        name: 'Mailchimp',
        category: 'marketing',
        categoryLabel: 'Marketing',
        description: 'Email newsletter audience synchronization, tag automation, and campaign trigger workflows.',
        iconType: 'mailchimp',
        iconBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        connected: isPlatformConnected('mailchimp', false),
        status: isPlatformConnected('mailchimp', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Mailchimp Marketing API v3.0',
        capabilities: ['Audience Sync', 'Tag Management', 'Campaign Triggering'],
        permissions: ['audiences.write', 'campaigns.read'],
        enables: ['Add qualified leads into targeted email marketing campaigns']
      },
      {
        id: 'meta_business',
        name: 'Meta Business Suite',
        category: 'marketing',
        categoryLabel: 'Marketing',
        description: 'Meta Ads Manager and Business Suite lead forms synchronization across Facebook and Instagram.',
        iconType: 'meta_business',
        iconBg: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
        connected: isPlatformConnected('meta_business', false),
        status: isPlatformConnected('meta_business', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Meta Marketing API v20.0',
        capabilities: ['Lead Ad Webhooks', 'Ad Campaign Metrics', 'Audience Retargeting'],
        permissions: ['ads_management', 'leads_retrieval'],
        enables: ['Instant notifications and automated AI follow-ups for new Meta Lead Ads']
      },
      {
        id: 'klaviyo',
        name: 'Klaviyo',
        category: 'marketing',
        categoryLabel: 'Marketing',
        description: 'E-commerce customer lifecycle marketing, SMS marketing, and automated customer segment triggers.',
        iconType: 'klaviyo',
        iconBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
        connected: isPlatformConnected('klaviyo', false),
        status: isPlatformConnected('klaviyo', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Klaviyo API 2024-02-15',
        capabilities: ['Customer Profiles', 'Event Tracking', 'SMS Flows'],
        permissions: ['profiles:read', 'events:write', 'segments:read'],
        enables: ['Trigger automated customer retention flows based on conversation events']
      },

      // Business Tools & Finance
      {
        id: 'stripe',
        name: 'Stripe Payments',
        category: 'finance',
        categoryLabel: 'Finance',
        description: 'Stripe payment notifications, invoice status tracking, and instant payment link generation.',
        iconType: 'stripe',
        iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        connected: isPlatformConnected('stripe', false),
        status: isPlatformConnected('stripe', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Stripe API 2024-06-20',
        capabilities: ['Payment Links', 'Invoice Verification', 'Subscription Status'],
        permissions: ['read_write', 'charges', 'invoices'],
        enables: ['Generate Stripe checkout links directly in client chat threads']
      },
      {
        id: 'paystack',
        name: 'Paystack',
        category: 'finance',
        categoryLabel: 'Finance',
        description: 'African business payment processing, instant customer transaction verification, and receipt logging.',
        iconType: 'paystack',
        iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        connected: isPlatformConnected('paystack', false),
        status: isPlatformConnected('paystack', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Paystack API v1',
        capabilities: ['Payment Verification', 'Payment Pages', 'Customer Balances'],
        permissions: ['transactions.read', 'pages.create'],
        enables: ['Verify payments and generate instant Paystack checkout links in WhatsApp chats']
      },
      {
        id: 'shopify',
        name: 'Shopify Store',
        category: 'sales',
        categoryLabel: 'Sales',
        description: 'Shopify product catalog lookup, order fulfillment tracking, and customer cart assistance.',
        iconType: 'shopify',
        iconBg: 'bg-emerald-600/20 text-emerald-300 border-emerald-600/30',
        connected: isPlatformConnected('shopify', false),
        status: isPlatformConnected('shopify', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Shopify Admin GraphQL API',
        capabilities: ['Order Lookup', 'Product Search', 'Customer Order History'],
        permissions: ['read_orders', 'read_products', 'read_customers'],
        enables: ['Check client order status and recommend products inside customer DMs']
      },
      {
        id: 'quickbooks',
        name: 'QuickBooks Online',
        category: 'finance',
        categoryLabel: 'Finance',
        description: 'Automated invoice reconciliation, business expense tracking, and accounting synchronization.',
        iconType: 'quickbooks',
        iconBg: 'bg-green-600/20 text-green-400 border-green-600/30',
        connected: false,
        status: 'coming-soon',
        lastSynced: 'In Development',
        officialApi: 'Intuit Developer API',
        capabilities: ['Invoice Sync', 'Customer Ledgers'],
        permissions: ['com.intuit.quickbooks.accounting'],
        enables: ['Automatic accounting reconciliation for customer transactions']
      },

      // Customer Support
      {
        id: 'zendesk',
        name: 'Zendesk Support',
        category: 'customer-support',
        categoryLabel: 'Customer Support',
        description: 'Convert complex customer inquiries from WhatsApp and Email into tracked Zendesk support tickets.',
        iconType: 'zendesk',
        iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        connected: isPlatformConnected('zendesk', false),
        status: isPlatformConnected('zendesk', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Zendesk Support REST API v2',
        capabilities: ['Ticket Creation', 'Agent Assignment', 'Satisfaction Ratings'],
        permissions: ['tickets:write', 'users:read'],
        enables: ['Escalate customer inquiries to your support team with 1 click']
      },
      {
        id: 'intercom',
        name: 'Intercom',
        category: 'customer-support',
        categoryLabel: 'Customer Support',
        description: 'Live customer chat widget synchronization and multi-channel conversational support inbox.',
        iconType: 'intercom',
        iconBg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        connected: isPlatformConnected('intercom', false),
        status: isPlatformConnected('intercom', false) ? 'connected' : 'available',
        lastSynced: 'Not connected',
        officialApi: 'Intercom REST API v2.10',
        capabilities: ['Live Chat Sync', 'Lead Routing', 'Help Center Lookup'],
        permissions: ['read', 'write'],
        enables: ['Sync website visitors and app chats into WIHGO central hub']
      }
    ];
  }, [platforms, customConnectedState]);

  // Counts
  const totalCount = allMarketplaceApps.length;
  const connectedCount = allMarketplaceApps.filter(a => a.connected).length;
  const availableCount = allMarketplaceApps.filter(a => !a.connected).length;

  // Filtered Apps
  const filteredApps = useMemo(() => {
    return allMarketplaceApps.filter(app => {
      // Tab filter
      if (activeTab === 'connected' && !app.connected) return false;
      if (activeTab === 'available' && app.connected) return false;

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'business-tools') {
          if (app.category !== 'finance' && app.category !== 'sales' && app.category !== 'business-tools') return false;
        } else if (app.category !== selectedCategory) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = app.name.toLowerCase().includes(q);
        const matchesDesc = app.description.toLowerCase().includes(q);
        const matchesCat = app.categoryLabel.toLowerCase().includes(q);
        const matchesApi = app.officialApi.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat && !matchesApi) return false;
      }

      return true;
    });
  }, [allMarketplaceApps, activeTab, selectedCategory, searchQuery]);

  const handleCardClick = (app: MarketplaceApp) => {
    if (app.id === 'google_workspace') {
      setIsGoogleWorkspaceModalOpen(true);
      return;
    }
    if (app.platformId && onToggleConnection) {
      onToggleConnection(app.platformId);
      return;
    }
    setSelectedAppForModal(app);
  };

  const handleToggleAppConnection = (app: MarketplaceApp) => {
    if (app.id === 'google_workspace') {
      setIsGoogleWorkspaceModalOpen(true);
      return;
    }
    if (app.platformId && onToggleConnection) {
      onToggleConnection(app.platformId);
      return;
    }
    const newConnected = !app.connected;
    setCustomConnectedState(prev => ({
      ...prev,
      [app.id]: newConnected
    }));

    if (app.platformId && onStatusChange) {
      onStatusChange(app.platformId, newConnected ? 'CONNECTED' : 'NOT CONNECTED');
    }
  };

  const renderAppIcon = (iconType: string, className: string = "w-6 h-6") => {
    switch (iconType) {
      case 'google_workspace': return <Layers className={`${className} text-teal-400`} />;
      case 'whatsapp': return <WhatsAppIcon className={className} />;
      case 'instagram': return <Camera className={`${className} text-pink-400`} />;
      case 'facebook': return <ThumbsUp className={`${className} text-blue-400`} />;
      case 'tiktok': return <Music2 className={`${className} text-cyan-400`} />;
      case 'linkedin': return <Briefcase className={`${className} text-sky-400`} />;
      case 'gmail': return <Mail className={`${className} text-rose-400`} />;
      case 'slack': return <Hash className={`${className} text-purple-400`} />;
      case 'teams': return <MessageSquare className={`${className} text-indigo-400`} />;
      case 'calendar': return <CalendarIcon className={`${className} text-teal-400`} />;
      case 'drive': return <HardDrive className={`${className} text-emerald-400`} />;
      case 'meet': return <Video className={`${className} text-teal-400`} />;
      case 'gdocs': return <FileText className={`${className} text-blue-400`} />;
      case 'gsheets': return <Table className={`${className} text-emerald-400`} />;
      case 'notion': return <Layers className={`${className} text-slate-200`} />;
      case 'hubspot': return <TrendingUp className={`${className} text-amber-400`} />;
      case 'salesforce': return <Building2 className={`${className} text-sky-400`} />;
      case 'zoho': return <Briefcase className={`${className} text-red-400`} />;
      case 'mailchimp': return <Mail className={`${className} text-yellow-400`} />;
      case 'meta_business': return <Bot className={`${className} text-blue-400`} />;
      case 'klaviyo': return <Zap className={`${className} text-teal-300`} />;
      case 'stripe': return <CreditCard className={`${className} text-indigo-400`} />;
      case 'paystack': return <DollarSign className={`${className} text-cyan-400`} />;
      case 'shopify': return <ShoppingBag className={`${className} text-emerald-400`} />;
      case 'quickbooks': return <DollarSign className={`${className} text-green-400`} />;
      case 'zendesk': return <Headphones className={`${className} text-emerald-400`} />;
      case 'intercom': return <MessageSquare className={`${className} text-sky-400`} />;
      default: return <LinkIcon className={className} />;
    }
  };

  const categoriesList: { id: ConnectorCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'communication', label: 'Communication' },
    { id: 'social', label: 'Social' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'crm', label: 'CRM' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'business-tools', label: 'Business Tools' },
    { id: 'email', label: 'Email' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'customer-support', label: 'Customer Support' },
    { id: 'finance', label: 'Finance' },
    { id: 'sales', label: 'Sales' }
  ];

  return (
    <div id="wihgo-business-connect-hub" className="space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      
      {/* ============================================================ */}
      {/* 1. HERO BANNER: EXACT MATCH TO USER REFERENCE INTERFACE       */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C1520] via-[#0E1A29] to-[#0A121D] border border-teal-500/30 p-6 sm:p-8 shadow-2xl shadow-teal-950/40">
        {/* Deep Ambient Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Heading & Engine Badge */}
          <div className="space-y-3 max-w-2xl">
            {/* WIHGO Connectors Engine Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>WIHGO Connectors Engine</span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Connect Your Business Services
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Seamlessly bridge client messages, emails, meetings, and CRM pipelines with real-time enterprise security and automated sync.
            </p>
          </div>

          {/* Right Column: Hero Metrics & Summary Stats */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 lg:gap-6 bg-slate-950/70 border border-teal-500/20 p-4 sm:p-5 rounded-2xl backdrop-blur-xl">
            {/* Metric 1: Active Hubs */}
            <div className="flex flex-col pr-4 sm:pr-6 border-r border-slate-800">
              <span className="text-2xl sm:text-3xl font-black text-teal-300 tracking-tight">
                {connectedCount}
              </span>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">
                ACTIVE HUBS
              </span>
            </div>

            {/* Metric 2: Sync Health */}
            <div className="flex flex-col pr-4 sm:pr-6 border-r border-slate-800">
              <span className="text-2xl sm:text-3xl font-black text-cyan-300 tracking-tight">
                100%
              </span>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">
                SYNC HEALTH
              </span>
            </div>

            {/* Metric 3: AI Automations */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                <span>12</span>
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">
                AI FLOWS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MARKETPLACE SEGMENT TABS & SEARCH BAR                     */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Navigation Tabs (All Integrations, Connected, Available/Future) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>All Integrations</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
              activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('connected')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'connected'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>Connected</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
              activeTab === 'connected' ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {connectedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'available'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>Available / Future</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
              activeTab === 'available' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {availableCount}
            </span>
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="relative w-full sm:w-72 md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter connectors..."
            className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-800 focus:border-teal-400 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CATEGORY FILTER PILLS                                     */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoriesList.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 4. APP CONNECTOR MARKETPLACE CARDS GRID                      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredApps.map((app) => {
          const isConnected = app.connected;
          const isComingSoon = app.status === 'coming-soon';

          return (
            <div
              key={app.id}
              onClick={() => handleCardClick(app)}
              className={`group relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border p-5 transition-all duration-200 flex flex-col justify-between cursor-pointer hover:shadow-xl ${
                isConnected
                  ? 'border-teal-500/30 hover:border-teal-400/60 hover:shadow-teal-950/30'
                  : 'border-slate-800/80 hover:border-slate-700 hover:shadow-black/40'
              }`}
            >
              {/* Top Row: Icon + Name + Category + Status Badge */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* App Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-md transition-transform group-hover:scale-105 ${app.iconBg}`}>
                      {renderAppIcon(app.iconType, "w-6 h-6")}
                    </div>

                    {/* App Title & Category */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-teal-200 transition-colors">
                        {app.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {app.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isConnected ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/40 text-teal-300 text-[11px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                        <span>Connected</span>
                      </span>
                    ) : isComingSoon ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
                        <Clock className="w-3 h-3" />
                        <span>Coming Soon</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold">
                        <span>Available</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                  {app.description}
                </p>
              </div>

              {/* Bottom Row: Official API badge + Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">
                  {app.officialApi}
                </span>

                {isConnected ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(app);
                    }}
                    className="py-1.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-3 h-3 text-teal-400" />
                    <span>Manage</span>
                  </button>
                ) : isComingSoon ? (
                  <button
                    disabled
                    className="py-1.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-bold cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAppConnection(app);
                    }}
                    className="py-1.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Missing a Connector / Request an Integration Card */}
        <div
          onClick={() => setIsRequestModalOpen(true)}
          className="group relative rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/60 border border-dashed border-teal-500/30 hover:border-teal-400 p-5 transition-all duration-200 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:shadow-teal-950/20"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-teal-500/30 bg-teal-500/10 text-teal-400 shadow-md group-hover:scale-105 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-teal-200 transition-colors">
                  Missing a Connector?
                </h3>
                <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                  Request Integration
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Don't see the tool you use? Request a custom connector and our integrations team will prioritize it for upcoming releases.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-4">
            <span className="text-[11px] text-slate-500">Fast review</span>
            <button
              type="button"
              className="py-1.5 px-3.5 rounded-xl bg-slate-800 group-hover:bg-teal-600 group-hover:text-white border border-slate-700 text-teal-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Submit Request</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {filteredApps.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
          <Layers className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No connectors found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or switching to a different category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setActiveTab('all');
            }}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. AI-POWERED BUSINESS INTELLIGENCE LAYER                    */}
      {/* ============================================================ */}
      <div className="mt-10 pt-8 border-t border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                AI-Powered Business Intelligence Layer
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-platform orchestration layer connecting messages, calendars, CRM records, and automated customer follow-ups
            </p>
          </div>

          <button
            onClick={openAiAssistant}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 w-fit cursor-pointer"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>Launch Business Assistant</span>
          </button>
        </div>

        {/* AI Capability Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Capability 1 */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Cross-Platform Message AI</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Analyzes inquiries across WhatsApp, Camera, and Gmail to generate smart one-click replies and summarize threads.
            </p>
          </div>

          {/* Capability 2 */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Customer Follow-Up Engine</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Monitors pending client commitments and prepares scheduled follow-up drafts for approval before delivery.
            </p>
          </div>

          {/* Capability 3 */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Real-Time Business Pulse</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Aggregates response times, lead conversion velocity, and engagement metrics into actionable daily insights.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. INTERACTIVE APP DETAIL & CONNECTION MODAL                 */}
      {/* ============================================================ */}
      {selectedAppForModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedAppForModal(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-[#0C121D] border border-teal-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-teal-950/50 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: App Info */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-md ${selectedAppForModal.iconBg}`}>
                  {renderAppIcon(selectedAppForModal.iconType, "w-7 h-7")}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedAppForModal.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-teal-300 font-semibold">
                      {selectedAppForModal.categoryLabel}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {selectedAppForModal.officialApi}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedAppForModal(null)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {selectedAppForModal.description}
            </p>

            {/* Connection Status Overview */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Connector Status</span>
              {selectedAppForModal.connected ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Synchronized & Connected</span>
                </span>
              ) : selectedAppForModal.status === 'coming-soon' ? (
                <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                  <Clock className="w-4 h-4" />
                  <span>Under Engineering Freeze</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-slate-400 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Authorization Required</span>
                </span>
              )}
            </div>

            {/* What WIHGO AI Can Access */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>What WIHGO AI Can Access</span>
              </h4>
              <div className="space-y-1.5">
                {selectedAppForModal.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-sans">
                    <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What This Connection Enables */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>What This Connection Enables</span>
              </h4>
              <div className="space-y-1.5">
                {selectedAppForModal.enables.map((en, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-sans">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span>{en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedAppForModal(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Close
              </button>

              {selectedAppForModal.connected ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleToggleAppConnection(selectedAppForModal);
                      setSelectedAppForModal(null);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                  >
                    Disconnect
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAppForModal(null);
                      if (selectedAppForModal.platformId && onOpenWorkspace) {
                        onOpenWorkspace(selectedAppForModal.platformId);
                      }
                    }}
                    className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : selectedAppForModal.status === 'coming-soon' ? (
                <button
                  disabled
                  className="py-2.5 px-5 rounded-xl bg-slate-800 text-slate-500 text-xs font-bold cursor-not-allowed"
                >
                  Coming Soon
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleToggleAppConnection(selectedAppForModal);
                    setSelectedAppForModal(null);
                  }}
                  className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Authorize & Connect</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Request Integration Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#0F1722] to-[#0A0F17] border border-teal-500/30 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl shadow-teal-950/40 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Request a Connector</h3>
                  <p className="text-xs text-slate-400">Tell us what application you need integrated with WIHGO AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {requestSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Request Received!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Thank you! Our integrations team has logged your request for <span className="text-teal-300 font-semibold">{requestAppName}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitIntegrationRequest} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Application / Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={requestAppName}
                    onChange={(e) => setRequestAppName(e.target.value)}
                    placeholder="e.g. Asana, Telegram, Jira, Pipedrive, Calendly..."
                    className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-teal-400 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={requestCategory}
                    onChange={(e) => setRequestCategory(e.target.value)}
                    className="w-full bg-slate-900/90 text-white text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-teal-400 focus:outline-none transition-all"
                  >
                    <option value="CRM / Sales">CRM & Sales Pipelines</option>
                    <option value="Communication">Communication & Messaging</option>
                    <option value="Productivity / Task">Productivity & Task Management</option>
                    <option value="Finance / Payments">Finance & Payments</option>
                    <option value="Marketing / Automation">Marketing & Automation</option>
                    <option value="Customer Support">Customer Support / Help Desk</option>
                    <option value="Other">Other Integration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    What would you like WIHGO AI to do with this app? (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    placeholder="e.g. Sync incoming leads, create new tasks automatically from chat..."
                    className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-teal-400 focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingRequest || !requestAppName.trim()}
                    className="py-2 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSubmittingRequest ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Submit Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Google Workspace Suite Hub Modal */}
      <GoogleWorkspaceGroupModal
        isOpen={isGoogleWorkspaceModalOpen}
        onClose={() => setIsGoogleWorkspaceModalOpen(false)}
        platforms={platforms}
        onOpenWorkspace={onOpenWorkspace as any}
      />
    </div>
  );
};
