import React, { useState } from 'react';
import { X, Copy, Check, Download, Send, CheckCircle2 } from 'lucide-react';
import { EmailMessage } from '../types/campaign';

interface EspExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: EmailMessage;
}

type EspType = 'mailchimp' | 'klaviyo' | 'convertkit' | 'activecampaign' | 'sendgrid';

export const EspExportModal: React.FC<EspExportModalProps> = ({ isOpen, onClose, email }) => {
  const [selectedEsp, setSelectedEsp] = useState<EspType>('mailchimp');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getEspAdaptedHtml = (esp: EspType): string => {
    let html = email.bodyHtml;

    switch (esp) {
      case 'mailchimp':
        html = html
          .replace(/Hi there,|Hey there,|Hey friend,/g, 'Hi *|FNAME|*,')
          .replace(/#\" style=\"color:[^;]+; text-decoration: underline;\">Unsubscribe<\/a>/g, '*|UNSUB|*" style="color: #6366f1; text-decoration: underline;">Unsubscribe</a>');
        break;
      case 'klaviyo':
        html = html
          .replace(/Hi there,|Hey there,|Hey friend,/g, "Hi {{ first_name|default:'friend' }},")
          .replace(/#\" style=\"color:[^;]+; text-decoration: underline;\">Unsubscribe<\/a>/g, '{% unsubscribe %}">Unsubscribe</a>');
        break;
      case 'convertkit':
        html = html
          .replace(/Hi there,|Hey there,|Hey friend,/g, 'Hi {{ subscriber.first_name }},')
          .replace(/#\" style=\"color:[^;]+; text-decoration: underline;\">Unsubscribe<\/a>/g, '{{ unsubscribe_url }}">Unsubscribe</a>');
        break;
      case 'activecampaign':
        html = html
          .replace(/Hi there,|Hey there,|Hey friend,/g, 'Hi %FIRSTNAME%,')
          .replace(/#\" style=\"color:[^;]+; text-decoration: underline;\">Unsubscribe<\/a>/g, '%UNSUBSCRIBELINK%">Unsubscribe</a>');
        break;
      case 'sendgrid':
        html = html
          .replace(/Hi there,|Hey there,|Hey friend,/g, 'Hi {{firstName}},')
          .replace(/#\" style=\"color:[^;]+; text-decoration: underline;\">Unsubscribe<\/a>/g, '{{{unsubscribe}}}">Unsubscribe</a>');
        break;
    }

    return html;
  };

  const adaptedHtml = getEspAdaptedHtml(selectedEsp);

  const handleCopy = () => {
    navigator.clipboard.writeText(adaptedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([adaptedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${email.stepName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${selectedEsp}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">ESP Export & Merge Tags</h2>
              <p className="text-xs text-slate-400">Formatted for instant import into your email service provider</p>
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
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          {/* Provider selector tabs */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Select Your Email Marketing Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(
                [
                  { id: 'mailchimp', name: 'Mailchimp' },
                  { id: 'klaviyo', name: 'Klaviyo' },
                  { id: 'convertkit', name: 'ConvertKit' },
                  { id: 'activecampaign', name: 'ActiveCamp.' },
                  { id: 'sendgrid', name: 'SendGrid' },
                ] as const
              ).map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedEsp(provider.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-center ${
                    selectedEsp === provider.id
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500 shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {provider.name}
                </button>
              ))}
            </div>
          </div>

          {/* Merge tag info pill */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div>
              <span className="text-slate-400">Personalization Merge Tag: </span>
              <code className="text-indigo-400 font-mono font-bold">
                {selectedEsp === 'mailchimp' && '*|FNAME|*'}
                {selectedEsp === 'klaviyo' && "{{ first_name|default:'friend' }}"}
                {selectedEsp === 'convertkit' && '{{ subscriber.first_name }}'}
                {selectedEsp === 'activecampaign' && '%FIRSTNAME%'}
                {selectedEsp === 'sendgrid' && '{{firstName}}'}
              </code>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Auto-Applied
            </span>
          </div>

          {/* Code preview box */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 flex flex-col h-60 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span>{selectedEsp}-template.html</span>
              <span>{adaptedHtml.length.toLocaleString()} bytes</span>
            </div>
            <pre className="p-4 flex-1 overflow-auto font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre">
              {adaptedHtml}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={handleDownloadHtml}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download HTML File</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted HTML'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
