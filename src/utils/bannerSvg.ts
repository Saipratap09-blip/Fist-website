import { VisualBannerConfig } from '../types/campaign';

export function generateBannerSvgString(
  config: VisualBannerConfig,
  width = 600,
  height = 260
): string {
  const {
    title,
    subtitle,
    badgeText = 'EXCLUSIVE OFFER',
    visualType = 'hero-gradient',
    accentColor = '#4F46E5',
    secondaryColor = '#7C3AED',
  } = config;

  // Escape XML chars
  const esc = (str: string) =>
    (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const cleanTitle = esc(title || 'Headline');
  const cleanSubtitle = esc(subtitle || 'Subtitle description');
  const cleanBadge = esc(badgeText.toUpperCase());

  if (visualType === 'voucher-sale') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="60%" stop-color="#1E1B4B"/>
      <stop offset="100%" stop-color="${accentColor}"/>
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#EF4444" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#EF4444" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>

  <!-- Decorative Dashed Border Frame -->
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="14" stroke="#EF4444" stroke-width="2" stroke-dasharray="6 6" opacity="0.6"/>

  <!-- Badge -->
  <g filter="url(#shadow)">
    <rect x="42" y="40" width="130" height="28" rx="14" fill="#DC2626"/>
    <text x="107" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">${cleanBadge}</text>
  </g>

  <!-- Title & Subtitle -->
  <text x="42" y="116" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5">${cleanTitle}</text>
  <text x="42" y="152" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#CBD5E1">${cleanSubtitle}</text>

  <!-- Voucher Stamp Pill Right Side -->
  <g filter="url(#shadow)" transform="translate(${width - 170}, 65)">
    <rect width="130" height="130" rx="16" fill="#18181B" stroke="#EF4444" stroke-width="2"/>
    <circle cx="65" cy="50" r="28" fill="#DC2626" opacity="0.15"/>
    <text x="65" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#FCA5A5" text-anchor="middle">SAVE</text>
    <text x="65" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle">25%</text>
    <rect x="18" y="94" width="94" height="20" rx="6" fill="#DC2626"/>
    <text x="65" y="108" font-family="monospace" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">VIPCODE</text>
  </g>
</svg>`;
  }

  if (visualType === 'product-spotlight') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <linearGradient id="accentG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}"/>
      <stop offset="100%" stop-color="${secondaryColor}"/>
    </linearGradient>
    <filter id="glowF">
      <feGaussianBlur stdDeviation="30" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>

  <!-- Atmospheric Glow Orb -->
  <circle cx="${width - 120}" cy="${height / 2}" r="110" fill="url(#accentG)" opacity="0.35" filter="url(#glowF)"/>

  <!-- Left Content -->
  <rect x="40" y="38" width="124" height="26" rx="13" fill="${accentColor}" opacity="0.2"/>
  <rect x="40" y="38" width="124" height="26" rx="13" stroke="${accentColor}" stroke-width="1.5"/>
  <text x="102" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" fill="${accentColor}" text-anchor="middle" letter-spacing="1">${cleanBadge}</text>

  <text x="40" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF">${cleanTitle}</text>
  <text x="40" y="146" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="400" fill="#94A3B8">${cleanSubtitle}</text>

  <!-- Metric Badges -->
  <g transform="translate(40, 180)">
    <rect width="140" height="42" rx="10" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="16" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#38BDF8">★ 99.4%</text>
    <text x="76" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" fill="#94A3B8">Satisfaction</text>
  </g>
  <g transform="translate(196, 180)">
    <rect width="140" height="42" rx="10" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="16" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#4ADE80">3.4x</text>
    <text x="56" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" fill="#94A3B8">Growth Rate</text>
  </g>

  <!-- 3D Geometric Card on Right -->
  <g transform="translate(${width - 180}, 50)">
    <rect width="130" height="160" rx="18" fill="url(#accentG)" opacity="0.9"/>
    <rect x="12" y="16" width="106" height="50" rx="10" fill="#FFFFFF" opacity="0.2"/>
    <circle cx="36" cy="41" r="12" fill="#FFFFFF"/>
    <line x1="58" y1="36" x2="98" y2="36" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    <line x1="58" y1="46" x2="88" y2="46" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
    <rect x="12" y="80" width="106" height="8" rx="4" fill="#FFFFFF" opacity="0.6"/>
    <rect x="12" y="96" width="76" height="8" rx="4" fill="#FFFFFF" opacity="0.6"/>
    <rect x="12" y="118" width="106" height="26" rx="8" fill="#FFFFFF"/>
    <text x="65" y="135" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="${accentColor}" text-anchor="middle">VERIFIED</text>
  </g>
</svg>`;
  }

  // Default: modern hero-gradient banner
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none">
  <defs>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}"/>
      <stop offset="50%" stop-color="${secondaryColor}"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <pattern id="mesh" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#FFFFFF" stroke-width="0.75" opacity="0.08"/>
    </pattern>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="${width}" height="${height}" fill="url(#primaryGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#mesh)"/>

  <!-- Glowing Accent Circles -->
  <circle cx="90%" cy="10%" r="130" fill="#FFFFFF" opacity="0.08"/>
  <circle cx="10%" cy="90%" r="150" fill="${accentColor}" opacity="0.15"/>

  <!-- Content Box -->
  <g filter="url(#shadow)">
    <!-- Pill Badge -->
    <rect x="40" y="38" width="128" height="26" rx="13" fill="#FFFFFF" opacity="0.2"/>
    <text x="104" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.2">${cleanBadge}</text>

    <!-- Headline -->
    <text x="40" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="url(#textGrad)" letter-spacing="-0.5">${cleanTitle}</text>
    
    <!-- Subtitle -->
    <text x="40" y="148" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#E2E8F0">${cleanSubtitle}</text>

    <!-- Star Rating / Trust Indicator -->
    <g transform="translate(40, 185)">
      <path d="M 0 0 L 3 6 L 10 7 L 5 12 L 6 19 L 0 15 L -6 19 L -5 12 L -10 7 L -3 6 Z" fill="#FBBF24" transform="translate(10, 0) scale(0.65)"/>
      <path d="M 0 0 L 3 6 L 10 7 L 5 12 L 6 19 L 0 15 L -6 19 L -5 12 L -10 7 L -3 6 Z" fill="#FBBF24" transform="translate(28, 0) scale(0.65)"/>
      <path d="M 0 0 L 3 6 L 10 7 L 5 12 L 6 19 L 0 15 L -6 19 L -5 12 L -10 7 L -3 6 Z" fill="#FBBF24" transform="translate(46, 0) scale(0.65)"/>
      <path d="M 0 0 L 3 6 L 10 7 L 5 12 L 6 19 L 0 15 L -6 19 L -5 12 L -10 7 L -3 6 Z" fill="#FBBF24" transform="translate(64, 0) scale(0.65)"/>
      <path d="M 0 0 L 3 6 L 10 7 L 5 12 L 6 19 L 0 15 L -6 19 L -5 12 L -10 7 L -3 6 Z" fill="#FBBF24" transform="translate(82, 0) scale(0.65)"/>
      <text x="102" y="6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#FFFFFF">Trusted by 10,000+ teams worldwide</text>
    </g>
  </g>
</svg>`;
}

export function downloadSvgAsFile(svgContent: string, filename = 'email-banner.svg') {
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadSvgAsPng(
  svgContent: string,
  width = 1200,
  height = 520,
  filename = 'email-banner.png'
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas blob generation failed'));
            return;
          }
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
          resolve();
        }, 'image/png');
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };

      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}
