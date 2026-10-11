"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Camera,
  Briefcase,
  Music2,
  ThumbsUp,
  X as XIcon,
  RefreshCw,
  Flame,
  Wand2,
  Layers,
  Video,
  FileText
} from 'lucide-react';

interface ContentCreationViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const ContentCreationView: React.FC<ContentCreationViewProps> = () => {
  const [contentType, setContentType] = useState<'post' | 'caption' | 'reels' | 'ad' | 'campaign'>('post');
  const [platform, setPlatform] = useState<string>('instagram');
  const [promptInput, setPromptInput] = useState<string>('');
  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const presets = [
    "New Product Launch & Discount Special",
    "Customer Success Story & Testimonial",
    "Behind The Scenes / Founder Story",
    "Top 5 Tips for Small Business Growth",
    "Limited-Time Promotional Offer"
  ];

  const handleGenerate = async (textOverride?: string) => {
    const text = textOverride || promptInput;
    if (!text.trim()) return;

    setIsLoading(true);
    setCopied(false);

    try {
      const res = await fetch('/api/ai/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: contentType === 'post' ? 'tool-post' : contentType === 'caption' ? 'tool-caption' : 'tool-content',
          input: `Platform: ${platform}\nType: ${contentType}\nTopic/Brief: ${text}`,
          tone: 'persuasive'
        })
      });

      const data = await res.json();
      setGeneratedResult(data.result || "Content generated successfully.");
    } catch (err) {
      setGeneratedResult(`🔥 [Generated Content for ${platform.toUpperCase()}]\n\n🚀 ${text}\n\nKey Highlights:\n- High engaging hook\n- Clear value proposition\n- Strong Call-To-Action\n\n#WIHGO #BusinessGrowth #SocialMediaStrategy #AI`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>AI Content Studio</span>
          <Wand2 className="w-5 h-5 text-purple-400" />
        </h1>
        <p className="text-xs text-slate-400">
          Generate viral posts, engaging captions, video scripts, and high-converting ad copy with WIHGO AI
        </p>
      </div>

      {/* Creation Configuration Panel */}
      <div className="bg-slate-900/90 border border-indigo-500/20 rounded-3xl p-6 backdrop-blur-xl space-y-6 shadow-xl">
        {/* Content Type Selector Tabs */}
        <div>
          <label className="text-xs font-extrabold text-slate-300 block mb-2 uppercase tracking-wider">
            1. Select Content Format
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'post', label: 'Social Post', icon: FileText },
              { id: 'caption', label: 'Caption & Hashtags', icon: Sparkles },
              { id: 'reels', label: 'Reel / TikTok Script', icon: Video },
              { id: 'ad', label: 'Ad Copy', icon: Flame },
              { id: 'campaign', label: 'Multi-Post Package', icon: Layers }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setContentType(tab.id as any)}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    contentType === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Platform Selector */}
        <div>
          <label className="text-xs font-extrabold text-slate-300 block mb-2 uppercase tracking-wider">
            2. Target Channel
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'instagram', label: 'Instagram', icon: Camera, color: 'text-pink-400' },
              { id: 'tiktok', label: 'TikTok', icon: Music2, color: 'text-cyan-400' },
              { id: 'facebook', label: 'Facebook', icon: ThumbsUp, color: 'text-blue-400' },
              { id: 'linkedin', label: 'LinkedIn', icon: Briefcase, color: 'text-sky-400' },
              { id: 'x', label: 'X (Twitter)', icon: XIcon, color: 'text-slate-200' }
            ].map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    platform === p.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${p.color}`} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Presets & Brief Input */}
        <div className="space-y-3">
          <label className="text-xs font-extrabold text-slate-300 block uppercase tracking-wider">
            3. Topic or Prompt
          </label>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {presets.map((pr, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPromptInput(pr);
                  handleGenerate(pr);
                }}
                className="py-1 px-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition-all"
              >
                + {pr}
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Describe what you want to post or write about (e.g., Launching our weekend 20% flash sale on wireless earbuds)..."
            className="w-full bg-slate-950 text-xs text-white p-3.5 rounded-2xl border border-indigo-500/30 focus:border-cyan-400 focus:outline-none shadow-inner"
          />

          <button
            id="btn-generate-content"
            onClick={() => handleGenerate()}
            disabled={isLoading || !promptInput.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs disabled:opacity-40 shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>WIHGO AI is drafting content...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Generate {contentType.toUpperCase()} Content</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Output Result Area */}
      {generatedResult && (
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 backdrop-blur-xl space-y-4 shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Generated {contentType.toUpperCase()} Output
              </h2>
            </div>

            <button
              id="btn-copy-generated-content"
              onClick={handleCopy}
              className="py-1.5 px-3.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
            {generatedResult}
          </div>
        </div>
      )}
    </div>
  );
};
