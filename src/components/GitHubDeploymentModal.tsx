import React, { useState } from 'react';
import {
  X,
  Github,
  Download,
  Copy,
  Check,
  Terminal,
  FileCode,
  Globe,
  Server,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { getGitHubRepositoryFiles, downloadGitHubProjectZip, RepoFile } from '../utils/githubFiles';

interface GitHubDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeploymentModal: React.FC<GitHubDeploymentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'files'>('guide');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const files = getGitHubRepositoryFiles();
  const [selectedFile, setSelectedFile] = useState<RepoFile>(files[0]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string, type: 'file' | 'cmd') => {
    navigator.clipboard.writeText(text);
    if (type === 'file') {
      setCopiedFile(id);
      setTimeout(() => setCopiedFile(null), 2000);
    } else {
      setCopiedCommand(id);
      setTimeout(() => setCopiedCommand(null), 2000);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      await downloadGitHubProjectZip();
    } catch (e) {
      console.error(e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-white border border-slate-700">
              <Github className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                GitHub Repository & Hosting Center
              </h2>
              <p className="text-xs text-slate-400">
                Full source code, GitHub Actions workflow, PWA configuration, and deployment guides.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:from-indigo-600 hover:to-purple-700 transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Packaging ZIP...' : 'Download Project ZIP'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-sm">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'guide'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>GitHub Hosting Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'files'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Source Code & GitHub Files ({files.length})</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'guide' ? (
            <div className="space-y-6">
              {/* Step 1: Initialize Git Repo */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">1</span>
                    <h3 className="font-semibold text-white">Push to your GitHub Repository</h3>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        `git init\ngit add .\ngit commit -m "feat: initial commit for CampaignCraft AI"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git\ngit push -u origin main`,
                        'git-cmd',
                        'cmd'
                      )
                    }
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedCommand === 'git-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCommand === 'git-cmd' ? 'Copied!' : 'Copy Commands'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 mb-3">
                  Open your terminal inside the project directory and run these commands to push the repository to GitHub:
                </p>
                <div className="rounded-lg bg-slate-950 p-3 font-mono text-xs text-emerald-400 border border-slate-800 overflow-x-auto">
                  <p><span className="text-slate-500"># Initialize git and stage all files</span></p>
                  <p>git init</p>
                  <p>git add .</p>
                  <p>git commit -m "feat: initial commit for CampaignCraft AI"</p>
                  <p>git branch -M main</p>
                  <p><span className="text-slate-500"># Link to your GitHub repo and push</span></p>
                  <p>git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git</p>
                  <p>git push -u origin main</p>
                </div>
              </div>

              {/* Step 2: GitHub Pages Deployment */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">2</span>
                  <h3 className="font-semibold text-white">Host on GitHub Pages with Automated GitHub Actions</h3>
                </div>
                <p className="text-xs text-slate-300 mb-3">
                  This project includes a ready-to-use continuous deployment workflow at <code className="bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300">.github/workflows/deploy.yml</code>.
                </p>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>Go to your GitHub repo page and click <strong>Settings</strong> &gt; <strong>Pages</strong> (on left sidebar).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>Under <strong>Build and deployment &gt; Source</strong>, choose <strong>GitHub Actions</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>Every push to <code className="text-indigo-300">main</code> will automatically build Vite and deploy the live site to your custom GitHub Pages URL!</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Vercel / Cloud Run Alternative */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">3</span>
                  <h3 className="font-semibold text-white">Alternative Full-Stack Hosting (Vercel & Docker)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                      <Server className="w-3.5 h-3.5 text-indigo-400" />
                      Vercel
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-2">
                      Connect your GitHub repo on Vercel. Add your <code className="text-indigo-300">GEMINI_API_KEY</code> in Environment Variables for server-side generation.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                      <Terminal className="w-3.5 h-3.5 text-purple-400" />
                      Docker & Cloud Run
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-2">
                      Run <code className="text-indigo-300">docker build -t campaign-craft .</code> using the included production multi-stage <code className="text-indigo-300">Dockerfile</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[440px]">
              {/* File list */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-y-auto p-2 space-y-1">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Repository Files
                </div>
                {files.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                      selectedFile.path === file.path
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{file.path}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {file.language}
                    </span>
                  </button>
                ))}
              </div>

              {/* Code viewer */}
              <div className="md:col-span-2 rounded-xl bg-slate-950 border border-slate-800 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50">
                  <div>
                    <span className="font-mono text-xs font-semibold text-white">{selectedFile.path}</span>
                    <p className="text-[10px] text-slate-400">{selectedFile.description}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedFile.content, selectedFile.path, 'file')}
                    className="flex items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    {copiedFile === selectedFile.path ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre selection:bg-indigo-500 selection:text-white">
                  {selectedFile.content}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400">
          <span>PWA compliant & GitHub Pages ready</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
