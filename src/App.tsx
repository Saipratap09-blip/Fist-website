import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mail,
  Layers,
  Sliders,
  Download,
  Github,
  RotateCcw,
  PlusCircle,
  Eye,
  CheckCircle2,
  ListFilter,
  Palette,
  ChevronDown,
  ChevronUp,
  FileCode,
  ShieldCheck,
  Zap,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { CampaignData, EmailMessage, CampaignPreset } from './types/campaign';
import { CAMPAIGN_PRESETS } from './data/templates';
import { EmailPreview } from './components/EmailPreview';
import { SubjectLineOptimizer } from './components/SubjectLineOptimizer';
import { VisualBannerStudio } from './components/VisualBannerStudio';
import { SpamAuditModal } from './components/SpamAuditModal';
import { EspExportModal } from './components/EspExportModal';
import { GitHubDeploymentModal } from './components/GitHubDeploymentModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Campaign Configuration State
  const [prompt, setPrompt] = useState(
    'Deliver a welcoming onboarding experience for our productivity workspace software, highlighting quick setup guides and team collaboration features.'
  );
  const [campaignType, setCampaignType] = useState<CampaignData['campaignType']>('welcome-sequence');
  const [audience, setAudience] = useState('Remote professionals and agile product teams');
  const [goal, setGoal] = useState('Maximize Day-7 user activation and workspace invites');
  const [tone, setTone] = useState('Encouraging, authoritative, and conversational');

  // Brand Kit State
  const [brandName, setBrandName] = useState('FlowDesk');
  const [brandColor, setBrandColor] = useState('#4F46E5');
  const [ctaText, setCtaText] = useState('Open Your Workspace');
  const [ctaUrl, setCtaUrl] = useState('https://example.com/workspace');
  const [senderName, setSenderName] = useState('Sarah from FlowDesk');
  const [senderEmail, setSenderEmail] = useState('sarah@flowdesk.io');
  const [companyAddress, setCompanyAddress] = useState('500 Howard Street, Suite 300, San Francisco, CA 94105');
  const [showBrandKit, setShowBrandKit] = useState(false);

  // Active Campaign State
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<CampaignData | null>(null);
  const [activeEmailIndex, setActiveEmailIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'preview' | 'subjects' | 'visuals' | 'brief'>('preview');

  // Modals State
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [showSpamModal, setShowSpamModal] = useState(false);
  const [showEspModal, setShowEspModal] = useState(false);

  // Initialize initial default campaign on mount
  useEffect(() => {
    const saved = localStorage.getItem('campaigncraft_active_campaign');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentCampaign(parsed);
        return;
      } catch (e) {
        console.error('Failed to parse saved campaign', e);
      }
    }
    // Generate initial campaign
    triggerGeneration();
  }, []);

  // Save active campaign to local storage
  useEffect(() => {
    if (currentCampaign) {
      localStorage.setItem('campaigncraft_active_campaign', JSON.stringify(currentCampaign));
    }
  }, [currentCampaign]);

  const triggerGeneration = async (overridePrompt?: string) => {
    setIsGenerating(true);
    const finalPrompt = overridePrompt || prompt;

    try {
      const response = await fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          campaignType,
          audience,
          goal,
          tone,
          brandName,
          brandColor,
          ctaText,
          ctaUrl,
          senderName,
          senderEmail,
          companyAddress,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate campaign: ${response.statusText}`);
      }

      const data = await response.json();
      const newCampaign: CampaignData = {
        id: `campaign-${Date.now()}`,
        createdAt: new Date().toISOString(),
        prompt: finalPrompt,
        campaignTitle: data.campaignTitle || `${brandName} - ${finalPrompt.slice(0, 30)}...`,
        campaignType,
        audience,
        goal,
        tone,
        brandName,
        brandColor,
        ctaText,
        ctaUrl,
        senderName,
        senderEmail,
        companyAddress,
        summary: data.summary || 'Strategic email campaign tailored for high conversion.',
        strategyNotes: data.strategyNotes || 'Optimized for high inbox placement and reader momentum.',
        emails: data.emails || [],
      };

      setCurrentCampaign(newCampaign);
      setActiveEmailIndex(0);
    } catch (err) {
      console.error('Error generating campaign:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyPreset = (preset: CampaignPreset) => {
    setPrompt(preset.prompt);
    setCampaignType(preset.campaignType);
    setAudience(preset.audience);
    setGoal(preset.goal);
    setTone(preset.tone);
    setBrandName(preset.brandName);
    setBrandColor(preset.brandColor);
    setCtaText(preset.ctaText);
    setCtaUrl(preset.ctaUrl);
    setSenderName(preset.senderName);
    triggerGeneration(preset.prompt);
  };

  const handleUpdateSubjectVariant = (variantIndex: number, updated: any) => {
    if (!currentCampaign) return;
    const emails = [...currentCampaign.emails];
    const currentEmail = { ...emails[activeEmailIndex] };
    const variants = [...currentEmail.subjectLineVariants];
    variants[variantIndex] = { ...variants[variantIndex], ...updated };
    currentEmail.subjectLineVariants = variants;
    emails[activeEmailIndex] = currentEmail;
    setCurrentCampaign({ ...currentCampaign, emails });
  };

  const handleSelectSubject = (index: number) => {
    if (!currentCampaign) return;
    const emails = [...currentCampaign.emails];
    const currentEmail = { ...emails[activeEmailIndex], selectedSubjectIndex: index };
    emails[activeEmailIndex] = currentEmail;
    setCurrentCampaign({ ...currentCampaign, emails });
  };

  const handleUpdateBanner = (updated: any) => {
    if (!currentCampaign) return;
    const emails = [...currentCampaign.emails];
    const currentEmail = {
      ...emails[activeEmailIndex],
      visualBanner: { ...emails[activeEmailIndex].visualBanner, ...updated },
    };
    emails[activeEmailIndex] = currentEmail;
    setCurrentCampaign({ ...currentCampaign, emails });
  };

  const handleUpdateEmailBody = (newHtml: string) => {
    if (!currentCampaign) return;
    const emails = [...currentCampaign.emails];
    emails[activeEmailIndex] = { ...emails[activeEmailIndex], bodyHtml: newHtml };
    setCurrentCampaign({ ...currentCampaign, emails });
  };

  const activeEmail = currentCampaign?.emails[activeEmailIndex] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Global Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 lg:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">CampaignCraft AI</h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Studio v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Complete AI Email Marketing Campaigns, Visual Headers & GitHub Deployment
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <PWAInstallButton />

            {/* GitHub & Deployment Center Button */}
            <button
              onClick={() => setShowGitHubModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700 transition"
              title="View repository files, GitHub Pages CI/CD workflow, and deployment instructions"
            >
              <Github className="w-4 h-4 text-indigo-400" />
              <span>GitHub & Deploy</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body: 2 Columns */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Prompt & Campaign Controls (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Campaign Studio
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">Powered by Gemini AI</span>
            </div>

            {/* Inspiration Presets */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Quick Inspiration Templates
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CAMPAIGN_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-600 hover:text-white text-slate-300 border border-slate-700/60 transition"
                  >
                    {preset.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Prompt */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Campaign Goal & Offer Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Describe your product launch, promotion, onboarding flow, or newsletter..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
              />
            </div>

            {/* Campaign Type Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Campaign Sequence Type
              </label>
              <select
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value as CampaignData['campaignType'])}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="welcome-sequence">3-Part Automated Welcome Series</option>
                <option value="product-launch">Product Launch Campaign (3 Emails)</option>
                <option value="cart-abandonment">Cart Win-Back Sequence (3 Emails)</option>
                <option value="black-friday">Limited Seasonal Blitz (Single Broadcast)</option>
                <option value="single">Single High-Impact Broadcast Announcement</option>
                <option value="newsletter">Weekly Curated Newsletter Issue</option>
              </select>
            </div>

            {/* Target Audience & Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Primary Goal
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Tone of Voice */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Tone of Voice
              </label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="e.g. Friendly, authoritative, urgent..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Brand Kit Accordion */}
            <div className="border-t border-slate-800/80 pt-3">
              <button
                type="button"
                onClick={() => setShowBrandKit(!showBrandKit)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider py-1 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Brand Kit & Sender Profile</span>
                </div>
                {showBrandKit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showBrandKit && (
                <div className="mt-3 space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400">Brand Name</label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400">Brand Color</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={brandColor}
                          onChange={(e) => setBrandColor(e.target.value)}
                          className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                        />
                        <span className="font-mono text-xs text-slate-300">{brandColor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400">Sender Name</label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400">Sender Email</label>
                      <input
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400">Primary CTA Text</label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400">CTA Target URL</label>
                      <input
                        type="url"
                        value={ctaUrl}
                        onChange={(e) => setCtaUrl(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <button
              onClick={() => triggerGeneration()}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 shadow-lg shadow-indigo-500/25 transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Campaign...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Complete Campaign</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Metrics & Strategy Summary */}
          {currentCampaign && (
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Campaign Blueprint</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentCampaign.summary}
              </p>
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Sequence Steps: {currentCampaign.emails.length}</span>
                <span>Created: {new Date(currentCampaign.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Campaign Canvas & Simulator (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Email Sequence Step Tabs */}
          {currentCampaign && currentCampaign.emails.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {currentCampaign.emails.map((email, idx) => (
                <button
                  key={email.id}
                  onClick={() => setActiveEmailIndex(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                    activeEmailIndex === idx
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{email.stepName.split(':')[0]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Studio Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 flex-wrap">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interactive Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'subjects'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Subject Line Matrix</span>
            </button>
            <button
              onClick={() => setActiveTab('visuals')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'visuals'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span>Visual Banner Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('brief')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'brief'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strategy Brief</span>
            </button>
          </div>

          {/* Active Email View */}
          {activeEmail ? (
            <div className="min-h-[640px]">
              {activeTab === 'preview' && (
                <EmailPreview
                  email={activeEmail}
                  brandName={brandName}
                  senderName={senderName}
                  senderEmail={senderEmail}
                  onOpenSpamAudit={() => setShowSpamModal(true)}
                  onOpenEspExport={() => setShowEspModal(true)}
                  onUpdateEmailBody={handleUpdateEmailBody}
                />
              )}

              {activeTab === 'subjects' && (
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
                  <SubjectLineOptimizer
                    variants={activeEmail.subjectLineVariants}
                    selectedIndex={activeEmail.selectedSubjectIndex}
                    onSelect={handleSelectSubject}
                    onUpdateVariant={handleUpdateSubjectVariant}
                  />
                </div>
              )}

              {activeTab === 'visuals' && (
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
                  <VisualBannerStudio
                    bannerConfig={activeEmail.visualBanner}
                    onChange={handleUpdateBanner}
                  />
                </div>
              )}

              {activeTab === 'brief' && (
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-5">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">
                      {activeEmail.stepName}
                    </h3>
                    <p className="text-xs text-indigo-400 font-mono">
                      Recommended Timing: {activeEmail.recommendedSendDelay}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Strategic Objective & Key Takeaways
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {activeEmail.keyTakeaways?.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Sequence Architecture Strategy
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentCampaign?.strategyNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-8 text-center text-slate-400">
              <div className="space-y-2">
                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto animate-pulse" />
                <p className="text-sm font-semibold text-white">No campaign generated yet</p>
                <p className="text-xs">Click "Generate Complete Campaign" in the left panel to begin.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Offline Indicator */}
      <OfflineIndicator />

      {/* GitHub Repository & Deployment Center Modal */}
      <GitHubDeploymentModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
      />

      {/* Spam & Hygiene Audit Modal */}
      {activeEmail && (
        <SpamAuditModal
          isOpen={showSpamModal}
          onClose={() => setShowSpamModal(false)}
          email={activeEmail}
        />
      )}

      {/* ESP Export & Merge Tag Modal */}
      {activeEmail && (
        <EspExportModal
          isOpen={showEspModal}
          onClose={() => setShowEspModal(false)}
          email={activeEmail}
        />
      )}
    </div>
  );
}
