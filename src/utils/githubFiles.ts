import JSZip from 'jszip';

export interface RepoFile {
  path: string;
  name: string;
  language: string;
  content: string;
  description: string;
}

export function getGitHubRepositoryFiles(): RepoFile[] {
  return [
    {
      path: '.github/workflows/deploy.yml',
      name: 'deploy.yml',
      language: 'yaml',
      description: 'Automated GitHub Actions workflow for building and deploying to GitHub Pages',
      content: `name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build production bundle
        run: npm run build

      - name: Upload GitHub Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`,
    },
    {
      path: 'README.md',
      name: 'README.md',
      language: 'markdown',
      description: 'Complete documentation, architecture guide, and hosting instructions',
      content: `# CampaignCraft AI - Email Marketing Campaign Generator

An AI-powered email marketing campaign studio that creates high-converting email sequences, multi-variant subject lines, responsive HTML/Plaintext copy, and custom visual headers from natural language prompts.

## Key Features

- **Multi-Email Automated Sequences**: Generate onboarding series, product launches, seasonal promotions, and win-back sequences.
- **Subject Line Optimizer**: 4 variants per email with predicted open rates, curiosity/urgency style tags, and spam risk ratings.
- **Mobile & Desktop Interactive Simulator**: Real-time rendering with iPhone frame, desktop client preview, dark mode toggle, and live inbox feed simulation.
- **Visual Banner Studio**: Generates customizable vector SVG banners and high-resolution downloadable PNG headers.
- **Deliverability & Spam Trigger Audit**: Real-time checklist scanning copy for all-caps words, high-risk spam keywords, and unsubscribe compliance.
- **ESP Integration Ready**: 1-click export formatted with merge tags for Mailchimp, Klaviyo, ConvertKit, Brevo, and SendGrid.
- **Progressive Web App (PWA)**: Works offline, installable on mobile and desktop home screens.

---

## Quickstart

### Prerequisites
- Node.js 20+ installed
- npm or pnpm

### Installation

\`\`\`bash
# 1. Clone your repository
git clone https://github.com/YOUR_USERNAME/campaign-craft-ai.git
cd campaign-craft-ai

# 2. Install dependencies
npm install

# 3. Create your environment configuration
cp .env.example .env
# Add your optional GEMINI_API_KEY into .env

# 4. Start local development server
npm run dev
\`\`\`

The application will be accessible at \`http://localhost:3000\`.

---

## Hosting on GitHub & Deployment Options

### Option 1: GitHub Pages (Static Hosting)
1. Push this codebase to your GitHub repository:
   \`\`\`bash
   git init
   git add .
   git commit -m "feat: initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/campaign-craft-ai.git
   git push -u origin main
   \`\`\`
2. Navigate to your GitHub repository **Settings > Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. The included workflow \`.github/workflows/deploy.yml\` will automatically trigger and deploy your web app.

### Option 2: Full-Stack Deployment (Vercel / Cloud Run / Render)
To take advantage of server-side Gemini 3.8 Flash generation:
- **Vercel**: Import the GitHub repository directly in the Vercel dashboard and provide \`GEMINI_API_KEY\` in Project Settings.
- **Docker / Cloud Run**: Use the provided \`Dockerfile\` to build a production container on port 3000.

---

## License
MIT License. Open source and free for commercial and personal use.
`,
    },
    {
      path: 'Dockerfile',
      name: 'Dockerfile',
      language: 'dockerfile',
      description: 'Production container configuration for Docker and Cloud Run',
      content: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src ./src

EXPOSE 3000
CMD ["npm", "start"]
`,
    },
    {
      path: '.gitignore',
      name: '.gitignore',
      language: 'text',
      description: 'Git ignore rules for Node and Vite builds',
      content: `node_modules
dist
dist-ssr
*.local
.env
.env.production
.DS_Store
*.log
`,
    },
    {
      path: 'LICENSE',
      name: 'LICENSE',
      language: 'text',
      description: 'Standard permissive open-source license',
      content: `MIT License

Copyright (c) ${new Date().getFullYear()} CampaignCraft AI Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`,
    },
  ];
}

export async function downloadGitHubProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Add root files
  const repoFiles = getGitHubRepositoryFiles();
  for (const file of repoFiles) {
    zip.file(file.path, file.content);
  }

  // Add package.json
  const packageJsonContent = JSON.stringify(
    {
      name: 'campaign-craft-ai',
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'tsx server.ts',
        build: 'vite build',
        start: 'tsx server.ts',
        preview: 'vite preview',
        lint: 'tsc --noEmit',
      },
      dependencies: {
        '@google/genai': '^2.4.0',
        '@tailwindcss/vite': '^4.3.3',
        '@vitejs/plugin-react': '^6.1.1',
        dotenv: '^17.2.3',
        express: '^4.21.2',
        jszip: '^3.10.1',
        'lucide-react': '^0.546.0',
        motion: '^12.23.24',
        react: '^19.0.1',
        'react-dom': '^19.0.1',
        tailwindcss: '^4.3.3',
        vite: '^8.3.0',
        'vite-plugin-pwa': '^1.2.0',
      },
      devDependencies: {
        '@types/express': '^4.17.21',
        '@types/jszip': '^3.4.1',
        '@types/node': '^22.14.0',
        '@types/react': '^19.3.0',
        '@types/react-dom': '^19.3.0',
        tsx: '^4.21.0',
        typescript: '^7.0.2',
      },
    },
    null,
    2
  );
  zip.file('package.json', packageJsonContent);

  // Add .env.example
  zip.file(
    '.env.example',
    `# Optional Gemini API key for dynamic AI generation
GEMINI_API_KEY=
PORT=3000
`
  );

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'campaign-craft-ai-github-ready.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
