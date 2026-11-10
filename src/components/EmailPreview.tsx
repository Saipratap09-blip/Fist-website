import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Mail,
  Code,
  FileText,
  Moon,
  Sun,
  Copy,
  Check,
  Download,
  Shield,
  Send,
  Eye,
  Sparkles,
} from 'lucide-react';
import { EmailMessage } from '../types/campaign';

interface EmailPreviewProps {
  email: EmailMessage;
  brandName: string;
  senderName: string;
  senderEmail: string;
  onOpenSpamAudit: () => void;
  onOpenEspExport: () => void;
  onUpdateEmailBody: (html: string) => void;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  email,
  brandName,
  senderName,
  senderEmail,
  onOpenSpamAudit,
  onOpenEspExport,
  onUpdateEmailBody,
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'inbox' | 'html' | 'plaintext'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [editableHtml, setEditableHtml] = useState(email.bodyHtml);

  // Sync if email changes
  React.useEffect(() => {
    setEditableHtml(email.bodyHtml);
  }, [email.bodyHtml]);

  const activeSubject =
    email.subjectLineVariants[email.selectedSubjectIndex]?.subject || email.headline;
  const activePreview =
    email.subjectLineVariants[email.selectedSubjectIndex]?.previewText || email.subheadline;

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(email.bodyHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([email.bodyHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${email.stepName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
      {/* Top Preview Controls Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/70 flex-wrap gap-2">
        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'desktop'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View (600px Max)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'mobile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile Smartphone View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
          <button
            onClick={() => setViewMode('inbox')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'inbox'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Inbox Simulator View"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inbox Feed</span>
          </button>
          <button
            onClick={() => setViewMode('html')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'html'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Inspect HTML Email Code"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HTML Code</span>
          </button>
          <button
            onClick={() => setViewMode('plaintext')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'plaintext'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Plain Text Fallback"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Plain Text</span>
          </button>
        </div>

        {/* Right side utilities */}
        <div className="flex items-center gap-2">
          {/* Light/Dark preview toggle */}
          <button
            onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title={`Switch to ${previewTheme === 'light' ? 'Dark Mode' : 'Light Mode'} email environment`}
          >
            {previewTheme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Spam Audit button */}
          <button
            onClick={onOpenSpamAudit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Spam & Health Audit</span>
          </button>

          {/* ESP Export button */}
          <button
            onClick={onOpenEspExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 text-xs font-semibold transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden md:inline">ESP Export</span>
          </button>

          {/* Copy HTML */}
          <button
            onClick={handleCopyHtml}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition"
            title="Copy HTML to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Download HTML */}
          <button
            onClick={handleDownloadHtml}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition"
            title="Download .html file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Email Metadata Ribbon */}
      <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/90 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Subject:</span>
            <span className="font-medium text-indigo-300">{activeSubject}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>From: <strong>{senderName}</strong> &lt;{senderEmail}&gt;</span>
            <span>&bull;</span>
            <span>Pre-header: {activePreview}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {email.recommendedSendDelay}
          </span>
        </div>
      </div>

      {/* Main View Area */}
      <div
        className={`flex-1 overflow-y-auto p-4 md:p-8 flex items-start justify-center transition-colors ${
          previewTheme === 'light' ? 'bg-slate-200/90' : 'bg-slate-950'
        }`}
      >
        {/* Desktop View */}
        {viewMode === 'desktop' && (
          <div className="w-full max-w-[640px] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-300 text-slate-900 animate-fadeIn">
            {/* Fake Desktop Mail Chrome */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span className="ml-2 font-semibold text-slate-700">Inbox Preview</span>
              </div>
              <div className="text-[11px] text-slate-400">Standard 600px Responsive Container</div>
            </div>

            {/* Email HTML Render */}
            <div
              className="email-content-wrapper"
              dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
            />
          </div>
        )}

        {/* Mobile View */}
        {viewMode === 'mobile' && (
          <div className="relative w-[360px] rounded-[44px] bg-slate-900 border-[10px] border-slate-800 shadow-2xl overflow-hidden animate-fadeIn text-slate-900">
            {/* iPhone Top Notch / Island */}
            <div className="bg-slate-900 h-7 flex items-center justify-between px-6 pt-1 text-[11px] text-white">
              <span>9:41</span>
              <div className="w-20 h-4 bg-black rounded-full" />
              <div className="flex items-center gap-1 text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Mobile Mail App Header */}
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 text-xs">
              <div className="font-bold text-slate-800 truncate">{activeSubject}</div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                From: {senderName}
              </div>
            </div>

            {/* Scrollable Mobile Body */}
            <div className="h-[520px] overflow-y-auto bg-white">
              <div
                className="email-content-wrapper"
                dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
              />
            </div>

            {/* Home Indicator bar */}
            <div className="bg-slate-900 h-4 flex items-center justify-center">
              <div className="w-24 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        )}

        {/* Inbox Simulator Feed View */}
        {viewMode === 'inbox' && (
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 text-slate-900">
            <div className="bg-slate-100 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Inbox Notification & Snippet Simulator
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">Primary Tab</span>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Highlighted Current Campaign Email */}
              <div className="p-4 bg-indigo-50/70 border-l-4 border-indigo-600 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {brandName.charAt(0) || 'B'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{senderName}</span>
                    <span className="text-[11px] font-semibold text-indigo-600">Just now</span>
                  </div>
                  <div className="font-bold text-xs text-slate-800 truncate mt-0.5">
                    {activeSubject}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {activePreview}
                  </p>
                </div>
              </div>

              {/* Sample simulated neighbor emails */}
              <div className="p-4 flex items-start gap-3 opacity-60">
                <div className="w-9 h-9 rounded-full bg-slate-400 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  G
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800">GitHub Notifications</span>
                    <span className="text-[11px] text-slate-400">10:45 AM</span>
                  </div>
                  <div className="font-semibold text-xs text-slate-700 truncate mt-0.5">
                    [GitHub Pages] Successful deployment for campaign-craft-ai
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    Your build completed in 42 seconds and is now published online...
                  </p>
                </div>
              </div>

              <div className="p-4 flex items-start gap-3 opacity-60">
                <div className="w-9 h-9 rounded-full bg-slate-400 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800">Stripe Billing</span>
                    <span className="text-[11px] text-slate-400">Yesterday</span>
                  </div>
                  <div className="font-semibold text-xs text-slate-700 truncate mt-0.5">
                    Your invoice summary for June
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    Payment was successfully received. Download your PDF receipt...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HTML Code Inspector */}
        {viewMode === 'html' && (
          <div className="w-full max-w-3xl rounded-xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col h-[520px] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-xs">
              <span className="font-mono text-slate-400">email-template.html</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isEditingCode) {
                      onUpdateEmailBody(editableHtml);
                      setIsEditingCode(false);
                    } else {
                      setIsEditingCode(true);
                    }
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 text-indigo-300 hover:text-white font-medium"
                >
                  {isEditingCode ? 'Apply Changes' : 'Edit Code'}
                </button>
                <button
                  onClick={handleCopyHtml}
                  className="px-2.5 py-1 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500"
                >
                  {copied ? 'Copied' : 'Copy HTML'}
                </button>
              </div>
            </div>
            {isEditingCode ? (
              <textarea
                value={editableHtml}
                onChange={(e) => setEditableHtml(e.target.value)}
                className="w-full flex-1 p-4 bg-slate-950 text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed"
              />
            ) : (
              <pre className="p-4 flex-1 overflow-auto font-mono text-xs text-indigo-200 leading-relaxed whitespace-pre selection:bg-indigo-600">
                {email.bodyHtml}
              </pre>
            )}
          </div>
        )}

        {/* Plain Text View */}
        {viewMode === 'plaintext' && (
          <div className="w-full max-w-2xl rounded-xl bg-slate-950 border border-slate-800 shadow-xl p-6 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
            {email.bodyPlaintext}
          </div>
        )}
      </div>
    </div>
  );
};
