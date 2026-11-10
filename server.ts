import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get Gemini Client with required User-Agent
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback high-quality generator if API key is missing or offline
function generateFallbackCampaign(params: {
  prompt: string;
  campaignType: string;
  audience?: string;
  goal?: string;
  tone?: string;
  brandName?: string;
  brandColor?: string;
  ctaText?: string;
  ctaUrl?: string;
  senderName?: string;
  senderEmail?: string;
}) {
  const brand = params.brandName || 'BrandCraft';
  const color = params.brandColor || '#4F46E5';
  const cta = params.ctaText || 'Claim Your Exclusive Access';
  const url = params.ctaUrl || 'https://example.com/special-offer';
  const topic = params.prompt || 'Exclusive New Product Launch';
  const audience = params.audience || 'Forward-thinking professionals and creators';
  const goal = params.goal || 'Maximize Conversions & Click-Through Rate';
  const tone = params.tone || 'Compelling, authoritative yet warm and conversational';
  const sender = params.senderName || 'Alex from ' + brand;

  const isSequence = params.campaignType === 'welcome-sequence' || params.campaignType === 'cart-abandonment' || params.campaignType === 'product-launch';

  const emails = [];

  if (isSequence) {
    emails.push({
      id: 'email-1',
      stepName: 'Email 1: Welcome & Immediate VIP Value',
      recommendedSendDelay: 'Instant (Day 0 - immediately upon signup/trigger)',
      subjectLineVariants: [
        { subject: `Welcome to ${brand}! Here is your VIP gift inside 🎁`, previewText: `We're thrilled to have you. Unbox your starter bonus today...`, openRateEstimate: 68, style: 'Curiosity + Gift', spamRisk: 'Very Low' },
        { subject: `Quick question for you, ${brand} insider...`, previewText: `Before you dive in, here is the #1 shortcut our top members use.`, openRateEstimate: 62, style: 'Conversational', spamRisk: 'Low' },
        { subject: `Your journey with ${brand} begins right now`, previewText: `Everything you need to reach your goals faster starting today.`, openRateEstimate: 59, style: 'Benefit-driven', spamRisk: 'Very Low' },
        { subject: `[Confirmed] Access unlocked: Welcome aboard`, previewText: `Your credentials and quick-start roadmap are ready inside.`, openRateEstimate: 65, style: 'Confirmation/Direct', spamRisk: 'Low' },
      ],
      selectedSubjectIndex: 0,
      headline: `Welcome to a Better Way with ${brand}`,
      subheadline: `You’re officially in. Here is everything you need to hit the ground running today.`,
      bodyHtml: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${brand}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, ${color} 0%, #7c3aed 100%); padding: 36px 32px; text-align: center; color: #ffffff;">
              <span style="display: inline-block; background-color: rgba(255,255,255,0.2); padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Welcome Aboard</span>
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; line-height: 1.25; color: #ffffff;">${brand}</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; color: #f1f5f9;">Built specifically for ${audience}</p>
            </td>
          </tr>
          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <p style="font-size: 17px; line-height: 1.6; color: #334155; margin-top: 0;">Hi there,</p>
              <p style="font-size: 16px; line-height: 1.6; color: #334155;">First, a huge welcome! You just took a massive step toward mastering <strong>${topic}</strong> with ${brand}.</p>
              <p style="font-size: 16px; line-height: 1.6; color: #334155;">We created ${brand} because standard tools are too bloated and complicated. Our entire mission is to help you achieve <em>real, measurable results</em> without unnecessary headaches.</p>
              
              <!-- Value Feature Box -->
              <div style="background-color: #f1f5f9; border-left: 4px solid ${color}; padding: 20px 24px; border-radius: 8px; margin: 28px 0;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #0f172a; font-weight: 700;">💡 Your 3-Minute Quick Win:</h3>
                <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #475569;">Log into your new dashboard, activate your custom workspace, and discover your personalized toolkit tailored directly for you.</p>
              </div>

              <!-- Primary Button -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0 24px 0;">
                <tr>
                  <td align="center" style="border-radius: 10px; background-color: ${color};">
                    <a href="${url}" target="_blank" style="display: inline-block; padding: 15px 32px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px;">${cta} &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 15px; line-height: 1.6; color: #475569;">If you ever have any questions, simply reply directly to this email. Our founders and team read and respond to every note.</p>
              <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 0;">Cheers to your success,<br><strong>${sender}</strong><br><span style="color: #64748b; font-size: 13px;">Founder, ${brand}</span></p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
              <p style="margin: 0 0 6px 0;">© ${new Date().getFullYear()} ${brand}. All rights reserved.</p>
              <p style="margin: 0 0 6px 0;">You received this email because you opted into updates from ${brand}.</p>
              <p style="margin: 0;"><a href="#" style="color: ${color}; text-decoration: underline;">Unsubscribe</a> &bull; <a href="#" style="color: ${color}; text-decoration: underline;">Preferences</a> &bull; <a href="#" style="color: ${color}; text-decoration: underline;">Privacy Policy</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      bodyPlaintext: `Hi there,

Welcome to ${brand}! You just took a massive step toward mastering ${topic}.

We created ${brand} because standard tools are too bloated and complicated. Our entire mission is to help you achieve real, measurable results without unnecessary headaches.

Your 3-Minute Quick Win:
Log into your new dashboard, activate your custom workspace, and discover your personalized toolkit.

Claim your access now: ${url}

If you ever have any questions, simply hit reply. We read every message.

Cheers to your success,
${sender}
Founder, ${brand}

Unsubscribe: [Unsubscribe Link] | © ${new Date().getFullYear()} ${brand}`,
      bodyMarkdown: `### Welcome to ${brand}!

Hi there,

First, a huge welcome! You just took a massive step toward mastering **${topic}** with **${brand}**.

We created ${brand} because standard tools are too bloated and complicated. Our entire mission is to help you achieve *real, measurable results*.

> **💡 Your 3-Minute Quick Win:**
> Log into your new dashboard, activate your custom workspace, and discover your personalized toolkit tailored for you.

[**${cta} →**](${url})

If you ever have any questions, simply reply directly to this email.

Cheers to your success,  
**${sender}**  
Founder, ${brand}`,
      cta: { text: cta, url },
      visualBanner: {
        title: `Welcome to ${brand}`,
        subtitle: `Your VIP starter access is unlocked.`,
        badgeText: 'VIP ACCESS',
        visualType: 'hero-gradient',
        accentColor: color,
        secondaryColor: '#7C3AED',
      },
      keyTakeaways: [
        'High personal touch welcoming the new subscriber',
        'Clear instant value hook and 3-minute quick win',
        'Prominent contrast CTA button with frictionless destination',
      ],
    });

    emails.push({
      id: 'email-2',
      stepName: 'Email 2: Problem Solving & Social Proof Story',
      recommendedSendDelay: 'Day 2 (48 hours after Email 1)',
      subjectLineVariants: [
        { subject: `The mistake 89% of people make with ${topic}...`, previewText: `And the simple 2-step fix we used to overcome it.`, openRateEstimate: 64, style: 'Intrigue / Curiosity', spamRisk: 'Low' },
        { subject: `How Sarah gained 3.4x faster results using ${brand}`, previewText: `A true breakdown of what works when everything else fails.`, openRateEstimate: 58, style: 'Social Proof / Case Study', spamRisk: 'Very Low' },
        { subject: `Why most approaches to ${topic} fall flat`, previewText: `Here is the missing link you might be overlooking...`, openRateEstimate: 61, style: 'Provocative', spamRisk: 'Very Low' },
        { subject: `Steal our tested playbook for ${topic}`, previewText: `Free framework inside to speed up your workflow.`, openRateEstimate: 66, style: 'Value-First', spamRisk: 'Low' },
      ],
      selectedSubjectIndex: 0,
      headline: `The Secret Behind Consistent Results`,
      subheadline: `How ordinary teams are accomplishing extraordinary milestones with ${brand}.`,
      bodyHtml: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Secret to ${topic}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, ${color} 100%); padding: 32px; text-align: center; color: #ffffff;">
              <span style="display: inline-block; background-color: rgba(255,255,255,0.2); padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Masterclass & Case Study</span>
              <h2 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.3; color: #ffffff;">The One Shift That Changes Everything</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px;">
              <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-top: 0;">Hey friend,</p>
              <p style="font-size: 16px; line-height: 1.6; color: #334155;">When people first tackle <strong>${topic}</strong>, they almost always run into the exact same brick wall:</p>
              <p style="font-size: 16px; line-height: 1.6; color: #dc2626; font-weight: 600; padding: 12px 16px; background-color: #fef2f2; border-radius: 8px;">❌ Trying to do everything manually and burning out after 2 weeks.</p>
              <p style="font-size: 16px; line-height: 1.6; color: #334155;">Here is what our customer Sarah discovered after switching to ${brand}:</p>
              
              <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px 24px; margin: 24px 0;">
                <p style="font-style: italic; font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 12px 0;">“I was spending 14 hours every single week trying to piece together disparate tools. Within 48 hours of using ${brand}, my conversion rate doubled and I reclaimed my weekends.”</p>
                <p style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0;">— Sarah M., Marketing Lead</p>
              </div>

              <p style="font-size: 16px; line-height: 1.6; color: #334155;">Ready to see the same breakthrough in your daily workflow?</p>

              <table border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center" style="border-radius: 10px; background-color: ${color};">
                    <a href="${url}" target="_blank" style="display: inline-block; padding: 15px 32px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px;">Explore the Case Study & Tools &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 15px; color: #334155;">Best,<br><strong>${sender}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8;">
              <p style="margin: 0;">© ${new Date().getFullYear()} ${brand} &bull; <a href="#" style="color: ${color};">Unsubscribe</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      bodyPlaintext: `Hey friend,

When people first tackle ${topic}, they almost always run into the exact same brick wall: trying to do everything manually and burning out.

Here is what Sarah discovered after switching to ${brand}:
"I was spending 14 hours every single week trying to piece together disparate tools. Within 48 hours of using ${brand}, my conversion rate doubled and I reclaimed my weekends." — Sarah M., Marketing Lead

Ready to see the same breakthrough in your workflow?
Explore the Case Study: ${url}

Best,
${sender}`,
      bodyMarkdown: `### The One Shift That Changes Everything

Hey friend,

When people first tackle **${topic}**, they almost always hit the same brick wall: trying to do everything manually and burning out.

> *"I was spending 14 hours every single week trying to piece together disparate tools. Within 48 hours of using ${brand}, my conversion rate doubled."*  
> — **Sarah M., Marketing Lead**

Ready to see the same breakthrough?

[**Explore Case Study & Tools →**](${url})

Best,  
**${sender}**`,
      cta: { text: 'Explore Case Study & Tools', url },
      visualBanner: {
        title: `Proven Results with ${brand}`,
        subtitle: `Real case studies and tested blueprints.`,
        badgeText: 'CASE STUDY',
        visualType: 'product-spotlight',
        accentColor: color,
        secondaryColor: '#0EA5E9',
      },
      keyTakeaways: [
        'Addresses the core obstacle and common mistake',
        'Engages audience with authentic testimonial & social proof',
        'Builds anticipation for the climax offer in Email 3',
      ],
    });

    emails.push({
      id: 'email-3',
      stepName: 'Email 3: The Irresistible Limited Offer (Conversion Climax)',
      recommendedSendDelay: 'Day 4 (72 hours after Email 2 - Deadline Day)',
      subjectLineVariants: [
        { subject: `[Final Call] 25% off ${brand} expires at midnight ⏳`, previewText: `Your VIP coupon is expiring in just a few hours. Don't leave this on the table.`, openRateEstimate: 72, style: 'Urgency & FOMO', spamRisk: 'Medium' },
        { subject: `This is your last chance to lock in lifetime pricing`, previewText: `Once the countdown hits zero, this special tier closes permanently.`, openRateEstimate: 67, style: 'Scarcity', spamRisk: 'Low' },
        { subject: `Are you in or out? (Offer ending tonight)`, previewText: `Here is our 100% risk-free guarantee to make this decision effortless.`, openRateEstimate: 63, style: 'Direct Challenge', spamRisk: 'Low' },
        { subject: `Your special invitation is about to disappear`, previewText: `Save big on ${brand} before midnight tonight.`, openRateEstimate: 61, style: 'Exclusive Benefit', spamRisk: 'Very Low' },
      ],
      selectedSubjectIndex: 0,
      headline: `Your 25% Founder Discount Expires Tonight`,
      subheadline: `Lock in full unlimited access before this promotion officially closes.`,
      bodyHtml: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Last Call: 25% Off ${brand}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, ${color} 100%); padding: 36px 32px; text-align: center; color: #ffffff;">
              <span style="display: inline-block; background-color: rgba(255,255,255,0.25); padding: 5px 16px; border-radius: 999px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">⏰ Expires at Midnight</span>
              <h2 style="margin: 0; font-size: 26px; font-weight: 800; line-height: 1.25; color: #ffffff;">25% OFF EXCLUSIVE PASS</h2>
              <p style="margin: 10px 0 0 0; font-size: 16px; color: #fef2f2;">Use promo code: <strong>VIPLAUNCH25</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px;">
              <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-top: 0;">Hi friend,</p>
              <p style="font-size: 16px; line-height: 1.6; color: #334155;">I wanted to send one last personal reminder: our introductory special for <strong>${topic}</strong> wraps up at 11:59 PM tonight.</p>
              
              <!-- Offer Summary Checklist -->
              <div style="background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 12px; padding: 20px 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #9d174d; font-weight: 700;">What You Get When You Join Today:</h3>
                <table width="100%" border="0" cellspacing="0" cellpadding="4">
                  <tr><td style="color: #9d174d; font-size: 15px;">✓ Full access to the entire ${brand} suite</td></tr>
                  <tr><td style="color: #9d174d; font-size: 15px;">✓ Premium pre-built campaign templates</td></tr>
                  <tr><td style="color: #9d174d; font-size: 15px;">✓ Priority 24/7 dedicated support</td></tr>
                  <tr><td style="color: #9d174d; font-size: 15px;">✓ 30-Day No-Questions-Asked Money Back Guarantee</td></tr>
                </table>
              </div>

              <table border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0 20px 0; width: 100%;">
                <tr>
                  <td align="center" style="border-radius: 10px; background-color: #dc2626;">
                    <a href="${url}?coupon=VIPLAUNCH25" target="_blank" style="display: block; padding: 18px 36px; font-size: 17px; font-weight: 800; color: #ffffff; text-decoration: none; border-radius: 10px; text-align: center; box-shadow: 0 6px 16px rgba(220, 38, 38, 0.35);">Lock In 25% Off Before Midnight &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; text-align: center; color: #64748b; margin-top: 10px;">🔒 Safe & secure checkout &bull; Instant activation</p>
              
              <p style="font-size: 15px; color: #334155; margin-top: 24px;">Don't look back in a month wishing you started today.<br><br>Warmly,<br><strong>${sender}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8;">
              <p style="margin: 0;">© ${new Date().getFullYear()} ${brand} &bull; <a href="#" style="color: ${color};">Unsubscribe</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      bodyPlaintext: `Hi friend,

Quick reminder: our introductory special for ${topic} wraps up at 11:59 PM tonight.

Use promo code: VIPLAUNCH25 for 25% off lifetime pricing.

What you get:
- Full access to the entire ${brand} suite
- Premium pre-built campaign templates
- Priority 24/7 support
- 30-Day Money Back Guarantee

Lock in your discount: ${url}?coupon=VIPLAUNCH25

Warmly,
${sender}`,
      bodyMarkdown: `### [FINAL CALL] 25% Off Expires Tonight!

Hi friend,

Our introductory special for **${topic}** wraps up at **11:59 PM tonight**.

> **Coupon Code:** \`VIPLAUNCH25\`  
> Saves 25% instantly on all tiers!

**What's included:**
- Full access to the entire ${brand} suite
- Premium pre-built templates
- Priority 24/7 support
- 30-Day Money-Back Guarantee

[**Lock In 25% Off Before Midnight →**](${url}?coupon=VIPLAUNCH25)

Warmly,  
**${sender}**`,
      cta: { text: 'Lock In 25% Off Before Midnight', url: `${url}?coupon=VIPLAUNCH25` },
      visualBanner: {
        title: `Flash Sale: 25% Off`,
        subtitle: `Use code VIPLAUNCH25 before midnight tonight.`,
        badgeText: 'FINAL HOURS',
        visualType: 'voucher-sale',
        accentColor: '#DC2626',
        secondaryColor: color,
      },
      keyTakeaways: [
        'Time-sensitive countdown scarcity with specific expiration time',
        'Clear coupon code and bold single-action button',
        'Risk reversal with 30-day money-back guarantee',
      ],
    });
  } else {
    // Single High-Impact Broadcast
    emails.push({
      id: 'email-single',
      stepName: 'Broadcast Announcement: ' + topic,
      recommendedSendDelay: 'Send immediately or schedule for Tuesday/Thursday 9:30 AM local time',
      subjectLineVariants: [
        { subject: `Introducing: ${topic} from ${brand}`, previewText: `A smarter way to reach your goals faster. Here is what is new...`, openRateEstimate: 66, style: 'Product Announcement', spamRisk: 'Very Low' },
        { subject: `We built something exciting for you... 👀`, previewText: `Months of testing went into this. Take the first tour now.`, openRateEstimate: 69, style: 'Curiosity Loop', spamRisk: 'Low' },
        { subject: `The future of ${topic} is finally here`, previewText: `Discover how our latest release changes the game for ${audience}.`, openRateEstimate: 63, style: 'Visionary / Big Idea', spamRisk: 'Very Low' },
        { subject: `[New Release] Unlock instant access to ${brand}`, previewText: `Everything you need to know + a limited early-adopter perk inside.`, openRateEstimate: 67, style: 'News & Value', spamRisk: 'Low' },
      ],
      selectedSubjectIndex: 0,
      headline: `Meet the All-New ${topic}`,
      subheadline: `Engineered from the ground up to give ${audience} an unfair advantage.`,
      bodyHtml: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background: linear-gradient(135deg, ${color} 0%, #1e1b4b 100%); padding: 40px 32px; text-align: center; color: #ffffff;">
              <span style="display: inline-block; background-color: rgba(255,255,255,0.2); padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px;">Special Announcement</span>
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; line-height: 1.25; color: #ffffff;">${topic}</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; color: #e0e7ff;">By ${brand}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px;">
              <p style="font-size: 17px; line-height: 1.6; color: #334155; margin-top: 0;">Hey there,</p>
              <p style="font-size: 16px; line-height: 1.6; color: #334155;">Today marks one of the biggest milestones in our company history. We are thrilled to officially unveil <strong>${topic}</strong>.</p>
              <p style="font-size: 16px; line-height: 1.6; color: #334155;">We spent countless hours listening to ${audience}, studying what slowed them down, and rebuilding the entire experience to be lightning fast, intuitive, and delightful.</p>
              
              <!-- 3 Bullet Value Pillars -->
              <div style="margin: 28px 0; background-color: #f8fafc; border-radius: 12px; padding: 20px 24px; border: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 14px 0; font-size: 16px; color: #0f172a; font-weight: 700;">Key Highlights You'll Love:</h3>
                <div style="margin-bottom: 10px; font-size: 15px; color: #334155;">⚡ <strong>Instant Setup:</strong> Zero complicated configuration required.</div>
                <div style="margin-bottom: 10px; font-size: 15px; color: #334155;">🎯 <strong>Measurable ROI:</strong> Engineered directly to boost ${goal}.</div>
                <div style="font-size: 15px; color: #334155;">🤝 <strong>Full Compatibility:</strong> Works seamlessly across all your existing tools.</div>
              </div>

              <table border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0 24px 0; width: 100%;">
                <tr>
                  <td align="center" style="border-radius: 10px; background-color: ${color};">
                    <a href="${url}" target="_blank" style="display: block; padding: 16px 32px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px; text-align: center;">${cta} &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 15px; line-height: 1.6; color: #475569;">Have thoughts or feedback? Reply directly to this email—we’re eager to hear what you think.</p>
              <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 0;">Warm regards,<br><strong>${sender}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8;">
              <p style="margin: 0;">© ${new Date().getFullYear()} ${brand} &bull; <a href="#" style="color: ${color};">Unsubscribe</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      bodyPlaintext: `Hey there,

Today marks a huge milestone: we are thrilled to officially unveil ${topic} from ${brand}.

Key Highlights:
- Instant Setup: Zero complicated configuration required
- Measurable ROI: Engineered directly to boost ${goal}
- Full Compatibility: Works seamlessly across your existing workflow

Take the tour now: ${url}

Have questions or feedback? Reply directly to this email.

Warm regards,
${sender}`,
      bodyMarkdown: `### Meet the All-New ${topic}

Hey there,

Today marks a major milestone: we are thrilled to officially unveil **${topic}** from **${brand}**.

**Key Highlights:**
- ⚡ **Instant Setup:** Zero complex configuration needed.
- 🎯 **Measurable ROI:** Engineered directly to achieve ${goal}.
- 🤝 **Seamless Integration:** Plugs into your everyday stack.

[**${cta} →**](${url})

Warm regards,  
**${sender}**`,
      cta: { text: cta, url },
      visualBanner: {
        title: topic,
        subtitle: `Engineered for ${audience}`,
        badgeText: 'NEW LAUNCH',
        visualType: 'hero-gradient',
        accentColor: color,
        secondaryColor: '#3B82F6',
      },
      keyTakeaways: [
        'Strong brand announcement with visionary framing',
        'Structured 3-pillar benefit breakdown for quick scanning',
        'High-converting action block designed for desktop and mobile',
      ],
    });
  }

  return {
    campaignTitle: `${brand} - ${topic}`,
    summary: `Complete high-conversion campaign crafted for ${audience} aiming to ${goal}. Generated with ${tone} voice.`,
    strategyNotes: `Send sequence optimized for maximum deliverability and customer engagement. Stagger communications to build emotional momentum and avoid spam filters.`,
    emails,
  };
}

// Generate campaign endpoint
app.post('/api/generate-campaign', async (req, res) => {
  try {
    const {
      prompt,
      campaignType = 'single',
      audience = 'target customers',
      goal = 'high conversion and engagement',
      tone = 'persuasive and friendly',
      brandName = 'Our Brand',
      brandColor = '#4F46E5',
      ctaText = 'Get Started Now',
      ctaUrl = 'https://example.com',
      senderName = 'Marketing Team',
      senderEmail = 'hello@example.com',
      companyAddress = '123 Innovation Way, Suite 400, San Francisco, CA 94107',
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const ai = getGeminiClient();

    // If Gemini client is available, let's call Gemini 3.8 Flash!
    if (ai) {
      try {
        const isSequence = campaignType === 'welcome-sequence' || campaignType === 'product-launch' || campaignType === 'cart-abandonment';
        const count = isSequence ? 3 : 1;

        const systemPrompt = `You are a world-class Email Marketing Director, Copywriting Legend, and HTML Email Developer.
Your task is to generate a comprehensive, highly profitable email marketing campaign tailored to the user's brief.

CRITICAL REQUIREMENTS:
1. Generate ${count} email(s) for this campaign (${isSequence ? '3-step sequence: Email 1: Welcome/Hook, Email 2: Social Proof/Value/Story, Email 3: High-Urgency Offer Climax' : '1 comprehensive broadcast email'}).
2. For each email, provide 4 high-converting subject line options with open rate estimates (between 55% and 82%), curiosity/urgency style tags, and spam risk ratings.
3. Provide a complete, fully inline-styled HTML email that works flawlessly in Gmail, Apple Mail, Outlook, iOS, and Android. It must have:
   - Max width 600px centered layout
   - Gorgeous gradient header with Brand Name: "${brandName}" and primary color: "${brandColor}"
   - Clear headings, paragraphs, styled callout/value boxes, bullet points, and prominent CTA button
   - Professional footer with unsubscribe link, preferences, copyright, and legal address: "${companyAddress}"
4. Provide clean Plain Text copy and Markdown version.
5. Provide visual banner specifications (title, subtitle, badgeText, visualType: "hero-gradient" | "product-spotlight" | "voucher-sale" | "announcement-badge", accentColor, secondaryColor).
6. Return strictly valid JSON matching the specified JSON schema without any markdown backticks or commentary outside JSON.`;

        const userMessage = `Create an email marketing campaign with:
- Topic / Offer: ${prompt}
- Campaign Type: ${campaignType} (${count} email(s))
- Target Audience: ${audience}
- Primary Goal: ${goal}
- Tone of Voice: ${tone}
- Brand Name: ${brandName}
- Brand Primary Color: ${brandColor}
- CTA Text: ${ctaText}
- CTA URL: ${ctaUrl}
- Sender Name: ${senderName}
- Sender Email: ${senderEmail}
- Company Address: ${companyAddress}

Respond with pure JSON object with structure:
{
  "campaignTitle": "string",
  "summary": "string",
  "strategyNotes": "string",
  "emails": [
    {
      "id": "email-1",
      "stepName": "string",
      "recommendedSendDelay": "string",
      "subjectLineVariants": [
        {
          "subject": "string",
          "previewText": "string",
          "openRateEstimate": 72,
          "style": "string",
          "spamRisk": "Low"
        }
      ],
      "selectedSubjectIndex": 0,
      "headline": "string",
      "subheadline": "string",
      "bodyHtml": "full responsive HTML string with inline CSS",
      "bodyPlaintext": "string",
      "bodyMarkdown": "string",
      "cta": { "text": "string", "url": "string" },
      "visualBanner": {
        "title": "string",
        "subtitle": "string",
        "badgeText": "string",
        "visualType": "hero-gradient",
        "accentColor": "${brandColor}",
        "secondaryColor": "#6366F1"
      },
      "keyTakeaways": ["string", "string", "string"]
    }
  ]
}`;

        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userMessage,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });

        const rawText = geminiResponse.text?.trim() || '';
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (parsed && Array.isArray(parsed.emails) && parsed.emails.length > 0) {
            res.json(parsed);
            return;
          }
        }
      } catch (geminiError: unknown) {
        console.warn('Gemini API call failed or timed out, using fallback generator:', geminiError);
        // Fall through to deterministic fallback generator
      }
    }

    // Fallback deterministic high-quality campaign
    const campaign = generateFallbackCampaign({
      prompt,
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
    });

    res.json(campaign);
  } catch (error: unknown) {
    console.error('Error generating campaign:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampaignCraft AI server listening on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
