"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { quoteSchema, type QuoteInput } from "@/lib/schemas";

export async function submitQuoteRequest(input: QuoteInput) {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  await prisma.quoteRequest.create({
    data: {
      shipperCompany: data.shipperCompany,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      originCity: data.originCity,
      originState: data.originState.toUpperCase(),
      destCity: data.destCity,
      destState: data.destState.toUpperCase(),
      pickupDate: new Date(data.pickupDate),
      equipmentType: data.equipmentType,
      loadType: data.loadType,
      weight: data.weight,
      commodity: data.commodity,
      notes: data.notes ?? "",
    },
  });

  const notifyEmail = process.env.NOTIFY_EMAIL ?? "dispatch@chavousllc.com";

  await sendEmail({
    to: notifyEmail,
    subject: `New load booking request: ${data.originCity}, ${data.originState} → ${data.destCity}, ${data.destState}`,
    html: `
      <h2>New load booking request</h2>
      <p><strong>Shipper:</strong> ${data.shipperCompany}</p>
      <p><strong>Contact:</strong> ${data.contactName} — ${data.email} — ${data.phone}</p>
      <p><strong>Lane:</strong> ${data.originCity}, ${data.originState} → ${data.destCity}, ${data.destState}</p>
      <p><strong>Pickup Date:</strong> ${data.pickupDate}</p>
      <p><strong>Equipment:</strong> ${data.equipmentType} (${data.loadType})</p>
      <p><strong>Weight:</strong> ${data.weight} lbs</p>
      <p><strong>Commodity:</strong> ${data.commodity}</p>
      ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}
    `,
  });

  await sendEmail({
    to: data.email,
    subject: "We received your load booking request — Chavous Transportation LLC",
    html: `
      <p>Hi ${data.contactName.split(" ")[0]},</p>
      <p>Thanks for requesting a quote from Chavous Transportation LLC for your ${data.originCity}, ${data.originState} → ${data.destCity}, ${data.destState} lane.</p>
      <p>Our dispatch team will follow up shortly with rate and availability.</p>
      <p>— Chavous Transportation LLC</p>
    `,
  });

  return { success: true as const };
}
