import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
};

// Emails are best-effort: if Resend isn't configured yet, log and continue
// so form submissions still save to the database during local development.
export async function sendEmail({ to, subject, html, attachments }: SendEmailArgs) {
  const from = process.env.EMAIL_FROM ?? "Chavous Transportation <onboarding@resend.dev>";

  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipping email "${subject}" to ${to}`);
    return { skipped: true };
  }

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      attachments: attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });
    return result;
  } catch (error) {
    console.error("[email] send failed", error);
    return { skipped: true, error };
  }
}
