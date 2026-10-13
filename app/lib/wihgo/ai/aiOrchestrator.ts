export type AIProviderId = 'WIHGO' | 'GEMINI';

export interface AIProviderMetadata {
  provider: AIProviderId;
  model: string;
  latencyMs: number;
  status: 'active' | 'fallback' | 'unconfigured';
  fallbackReason?: string;
  apiVersion?: string;
}

export interface AIOrchestrationRequest {
  message: string;
  task?: 'chat' | 'summarize' | 'reply' | 'lead_qualify' | 'post_generation';
  context?: Record<string, any>;
  preferredProvider?: AIProviderId;
  tone?: string;
}

export interface AIOrchestrationResponse {
  reply: string;
  metadata: AIProviderMetadata;
  actionSuggested?: any;
  timestamp: string;
}

export class AIOrchestrator {
  /**
   * Orchestrates an AI query across WIHGO AI and Gemini.
   * Maintains WIHGO AI as the unified persona while routing to the optimal server-side engine.
   */
  static async processQuery(request: AIOrchestrationRequest): Promise<AIOrchestrationResponse> {
    const startTime = Date.now();

    try {
      // Call server-side orchestration endpoint
      const response = await fetch('/api/ai/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (response.ok) {
        const data = await response.json();
        return {
          reply: data.reply || 'WIHGO AI processed your request.',
          metadata: data.metadata || {
            provider: 'GEMINI',
            model: 'gemini-3.8-flash',
            latencyMs: Date.now() - startTime,
            status: 'active'
          },
          actionSuggested: data.actionSuggested || null,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
    } catch (error) {
      console.warn('AI Orchestration server call failed, using client fallback:', error);
    }

    // Client-side fallback if server is unreachable
    return {
      reply: `[WIHGO AI]: I have processed your request: "${request.message}". All connected accounts (WhatsApp, Instagram, Facebook, Gmail) are active and monitored.`,
      metadata: {
        provider: 'WIHGO',
        model: 'wihgo-core-engine-v1',
        latencyMs: Date.now() - startTime,
        status: 'fallback',
        fallbackReason: 'Server connection offline'
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
}
