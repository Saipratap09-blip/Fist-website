import React, { useState } from 'react';
import { VisualBannerConfig } from '../types/campaign';
import { generateBannerSvgString, downloadSvgAsFile, downloadSvgAsPng } from '../utils/bannerSvg';
import { Image as ImageIcon, Download, Copy, Check, Sparkles, Sliders } from 'lucide-react';

interface VisualBannerStudioProps {
  bannerConfig: VisualBannerConfig;
  onChange: (updated: Partial<VisualBannerConfig>) => void;
}

export const VisualBannerStudio: React.FC<VisualBannerStudioProps> = ({
  bannerConfig,
  onChange,
}) => {
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);

  const svgContent = generateBannerSvgString(bannerConfig);

  const handleCopySvg = () => {
    navigator.clipboard.writeText(svgContent);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  const handleDownloadPng = async () => {
    try {
      setIsExportingPng(true);
      await downloadSvgAsPng(svgContent, 1200, 520, `${bannerConfig.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-banner.png`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingPng(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Banner Preview Frame */}
      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 shadow-inner">
        <div
          className="w-full rounded-lg overflow-hidden flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadSvgAsFile(svgContent, 'email-banner.svg')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download SVG</span>
          </button>
          <button
            onClick={handleDownloadPng}
            disabled={isExportingPng}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isExportingPng ? 'Rendering PNG...' : 'Download Hi-Res PNG'}</span>
          </button>
        </div>

        <button
          onClick={handleCopySvg}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          {copiedSvg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedSvg ? 'SVG Copied!' : 'Copy SVG Code'}</span>
        </button>
      </div>

      {/* Banner Customization Controls */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Visual Banner Controls</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400">Headline</label>
            <input
              type="text"
              value={bannerConfig.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400">Subtitle</label>
            <input
              type="text"
              value={bannerConfig.subtitle}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400">Badge Text</label>
            <input
              type="text"
              value={bannerConfig.badgeText}
              onChange={(e) => onChange({ badgeText: e.target.value })}
              className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400">Layout Style</label>
            <select
              value={bannerConfig.visualType}
              onChange={(e) =>
                onChange({ visualType: e.target.value as VisualBannerConfig['visualType'] })
              }
              className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="hero-gradient">Modern Gradient Hero</option>
              <option value="product-spotlight">Product & Milestone Spotlight</option>
              <option value="voucher-sale">Promotional Voucher & Badge</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400">Accent Color</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={bannerConfig.accentColor}
                onChange={(e) => onChange({ accentColor: e.target.value })}
                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-xs text-slate-300">{bannerConfig.accentColor}</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400">Secondary Color</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={bannerConfig.secondaryColor}
                onChange={(e) => onChange({ secondaryColor: e.target.value })}
                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-xs text-slate-300">{bannerConfig.secondaryColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
