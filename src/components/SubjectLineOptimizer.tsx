import React, { useState } from 'react';
import { SubjectLineVariant } from '../types/campaign';
import { Sparkles, Check, Edit2, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SubjectLineOptimizerProps {
  variants: SubjectLineVariant[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onUpdateVariant: (index: number, updated: Partial<SubjectLineVariant>) => void;
}

export const SubjectLineOptimizer: React.FC<SubjectLineOptimizerProps> = ({
  variants,
  selectedIndex,
  onSelect,
  onUpdateVariant,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editPreview, setEditPreview] = useState('');

  const startEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditSubject(variants[idx].subject);
    setEditPreview(variants[idx].previewText);
  };

  const saveEdit = (idx: number) => {
    onUpdateVariant(idx, {
      subject: editSubject,
      previewText: editPreview,
    });
    setEditingIndex(null);
  };

  const getSpamBadge = (risk: SubjectLineVariant['spamRisk']) => {
    switch (risk) {
      case 'Very Low':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> Very Low Risk
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
            <ShieldCheck className="w-3 h-3" /> Low Risk
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> Caution
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" /> High Risk
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Subject Line A/B Test Matrix
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Click variant to activate as primary email subject
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {variants.map((v, idx) => {
          const isSelected = selectedIndex === idx;
          const isEditing = editingIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-xl p-3.5 transition border ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isEditing ? (
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">Subject Line</label>
                    <input
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">Preview Text</label>
                    <input
                      type="text"
                      value={editPreview}
                      onChange={(e) => setEditPreview(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(idx)}
                      className="px-3 py-1 text-xs font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => onSelect(idx)}
                    className="flex-1 cursor-pointer select-none space-y-1"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-white flex items-center gap-1.5">
                        {v.subject}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      <span className="text-slate-500 font-medium">Preview:</span> {v.previewText}
                    </p>
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {v.style}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                        <TrendingUp className="w-3 h-3" /> {v.openRateEstimate}% Open Rate
                      </span>
                      {getSpamBadge(v.spamRisk)}
                      <span className="text-[11px] text-slate-500">
                        {v.subject.length} chars
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(idx)}
                      title="Edit Subject Line"
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!isSelected && (
                      <button
                        onClick={() => onSelect(idx)}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-indigo-600 hover:text-white transition"
                      >
                        Use
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
