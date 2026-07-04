"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { contactSchema, type ContactInput } from "@/lib/schemas";

export async function submitContactMessage(input: ContactInput) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  await prisma.contactMessage.create({ data });

  const notifyEmail = process.env.NOTIFY_EMAIL ?? "dispatch@chavousllc.com";
  await sendEmail({
    to: notifyEmail,
    subject: `New contact message from ${data.name}`,
    html: `
      <h2>New contact message</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || "—"}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br/>")}</p>
    `,
  });

  return { success: true as const };
}
