import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not configured. Email sending will fail.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@taxflow.app";

interface NudgeEmailParams {
  to: string;
  name: string;
  missingItems: Array<{ title: string; category: string }>;
  taxYear: number;
  dashboardUrl: string;
}

/**
 * Send a nudge email reminding user about missing tax documents
 */
export async function sendNudgeEmail({
  to,
  name,
  missingItems,
  taxYear,
  dashboardUrl,
}: NudgeEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const itemsList = missingItems
      .map(
        (item) =>
          `  • ${item.title}${item.category ? ` (${item.category})` : ""}`
      )
      .join("\n");

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tax Document Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
    <h1 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 24px;">📋 Tax Document Reminder</h1>
    <p style="color: #666; margin: 0;">Weekly update for Tax Year ${taxYear}</p>
  </div>

  <div style="margin-bottom: 30px;">
    <p>Hi ${name},</p>
    
    <p>This is your weekly reminder that you have <strong>${missingItems.length} required document${missingItems.length > 1 ? "s" : ""}</strong> left to collect for Tax Year ${taxYear}.</p>

    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>Still Missing:</strong>
      <pre style="margin: 10px 0 0 0; font-family: inherit; white-space: pre-wrap;">${itemsList}</pre>
    </div>

    <p>Tax season is approaching fast! The sooner you collect these documents, the easier filing will be.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${dashboardUrl}" style="display: inline-block; background: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
        View Your Checklist →
      </a>
    </div>

    <p style="color: #666; font-size: 14px;">
      <strong>Tip:</strong> Upload documents as you receive them to keep your progress updated.
    </p>
  </div>

  <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; color: #666; font-size: 12px; text-align: center;">
    <p>You're receiving this email because you have an active TaxFlow account with weekly nudges enabled.</p>
    <p>© ${new Date().getFullYear()} TaxFlow. All rights reserved.</p>
  </div>
</body>
</html>
    `;

    const textContent = `
Tax Document Reminder - Tax Year ${taxYear}

Hi ${name},

This is your weekly reminder that you have ${missingItems.length} required document${missingItems.length > 1 ? "s" : ""} left to collect for Tax Year ${taxYear}.

Still Missing:
${itemsList}

Tax season is approaching fast! The sooner you collect these documents, the easier filing will be.

View your checklist: ${dashboardUrl}

Tip: Upload documents as you receive them to keep your progress updated.

---
You're receiving this email because you have an active TaxFlow account with weekly nudges enabled.
© ${new Date().getFullYear()} TaxFlow. All rights reserved.
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `📋 TaxFlow Reminder: ${missingItems.length} document${missingItems.length > 1 ? "s" : ""} missing for ${taxYear}`,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log("Nudge email sent successfully:", data?.id);
    return { success: true };
  } catch (error) {
    console.error("Send nudge email error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<{ success: boolean }> {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to TaxFlow!",
      html: `
        <h1>Welcome to TaxFlow, ${name}!</h1>
        <p>Thank you for signing up. We're here to help you stay organized during tax season.</p>
        <p>Get started by uploading your first tax document or connecting Gmail/Drive.</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard">Go to Dashboard</a></p>
      `,
    });

    if (error) {
      console.error("Welcome email error:", error);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Send welcome email error:", error);
    return { success: false };
  }
}

