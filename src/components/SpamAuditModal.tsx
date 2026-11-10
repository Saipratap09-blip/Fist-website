import React from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle, Info, Sparkles } from 'lucide-react';
import { EmailMessage } from '../types/campaign';

interface SpamAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: EmailMessage;
}

export const SpamAuditModal: React.FC<SpamAuditModalProps> = ({ isOpen, onClose, email }) => {
  if (!isOpen) return null;

  const currentSubject = email.subjectLineVariants[email.selectedSubjectIndex]?.subject || '';
  const bodyText = email.bodyPlaintext || email.bodyHtml;

  // Spam triggers check
  const triggers: { rule: string; passed: boolean; tip: string; severity: 'low' | 'med' | 'high' }[] = [];

  // 1. All-Caps check in subject
  const capsWords = currentSubject.split(' ').filter((w) => w.length > 3 && w === w.toUpperCase());
  triggers.push({
    rule: 'Subject Line Capitalization',
    passed: capsWords.length <= 1,
    tip: capsWords.length > 1 ? `Avoid excessive uppercase words (${capsWords.join(', ')}). Mailbox providers flag this as spam.` : 'Balanced capitalization detected.',
    severity: 'high',
  });

  // 2. Exclamation mark overload
  const exclamations = (currentSubject.match(/!/g) || []).length;
  triggers.push({
    rule: 'Punctuation Hygiene',
    passed: exclamations <= 1,
    tip: exclamations > 1 ? `Found ${exclamations} exclamation marks in subject line. Limit to 0-1.` : 'Clean punctuation with no excessive exclamation marks.',
    severity: 'med',
  });

  // 3. Subject line length
  const subLen = currentSubject.length;
  const lenOk = subLen >= 25 && subLen <= 65;
  triggers.push({
    rule: 'Subject Length (Mobile Cutoff)',
    passed: lenOk,
    tip: lenOk ? `Subject is ${subLen} characters (ideal mobile display range: 30-60).` : `Subject is ${subLen} characters. Aim for 30-60 characters to prevent truncation on smartphones.`,
    severity: 'low',
  });

  // 4. Unsubscribe link presence
  const hasUnsub = /unsubscribe|opt-out/i.test(bodyText) || /unsubscribe/i.test(email.bodyHtml);
  triggers.push({
    rule: 'CAN-SPAM / GDPR Unsubscribe Mechanism',
    passed: hasUnsub,
    tip: hasUnsub ? 'Valid unsubscribe footer detected.' : 'Missing explicit unsubscribe link. This can lead to heavy ISP penalization.',
    severity: 'high',
  });

  // 5. Postal address presence
  const hasAddress = /rights reserved|suite|way|street|road|box|\d{5}/i.test(bodyText) || /address/i.test(email.bodyHtml);
  triggers.push({
    rule: 'Physical Address Identification',
    passed: hasAddress,
    tip: hasAddress ? 'Physical sender footer verified.' : 'Legitimate campaigns must include a sender street or postal address.',
    severity: 'med',
  });

  // 6. High-risk spam keywords
  const spamKeywords = ['100% free', 'make money fast', 'act now!!!', 'cash bonus', 'no catch', 'risk free!!'];
  const foundKeywords = spamKeywords.filter((k) => currentSubject.toLowerCase().includes(k) || bodyText.toLowerCase().includes(k));
  triggers.push({
    rule: 'Spam Keyword Filtering',
    passed: foundKeywords.length === 0,
    tip: foundKeywords.length === 0 ? 'No blacklisted spam phrases detected.' : `Found flagged phrases: ${foundKeywords.join(', ')}.`,
    severity: 'high',
  });

  const passedCount = triggers.filter((t) => t.passed).length;
  const score = Math.round((passedCount / triggers.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Deliverability & Spam Audit</h2>
              <p className="text-xs text-slate-400">Inbox placement checklist & spam trap analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Score Card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                Deliverability Health Score
              </div>
              <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-2">
                <span className={score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400'}>
                  {score}/100
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {score >= 80 ? 'High Primary Inbox Probability' : 'Needs Optimization'}
                </span>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              score >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {score >= 80 ? 'PASSED' : 'CAUTION'}
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2.5">
            {triggers.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs"
              >
                {item.passed ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{item.rule}</span>
                    <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                      item.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {item.passed ? 'Pass' : 'Review'}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">{item.tip}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Deliverability Tip */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              <strong>Pro Sender Tip:</strong> Always authenticate your sending domain with <strong>DKIM</strong>, <strong>SPF</strong>, and <strong>DMARC</strong> records in your DNS provider before sending to Gmail and Yahoo recipients.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
