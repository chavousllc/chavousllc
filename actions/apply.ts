"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { fillDriverApplicationPdf } from "@/lib/pdf";
import { buildApplicationUpdateData } from "@/lib/application-data";
import { findDraftByResumeToken } from "@/lib/apply-draft-lookup";
import { applicationSchema, DOCUMENT_TYPES, type ApplicationInput } from "@/lib/schemas";

export async function submitDriverApplication(resumeToken: string, input: ApplicationInput) {
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  const draft = await findDraftByResumeToken(resumeToken);
  if (!draft) {
    return { success: false as const, error: "This application could not be found or was already submitted." };
  }

  const requiredDocumentTypes = DOCUMENT_TYPES.filter((d) => d.required).map((d) => d.value);
  const uploadedTypes = new Set(draft.documents.map((d) => d.type));
  const missingDocument = requiredDocumentTypes.find((type) => !uploadedTypes.has(type));
  if (missingDocument) {
    return { success: false as const, error: "Please upload all required documents before submitting." };
  }

  const pdfBuffer = await fillDriverApplicationPdf(data);
  const pdfFileName = `driver-application-${data.fullName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`;

  await prisma.driverApplication.update({
    where: { id: draft.id },
    data: {
      ...buildApplicationUpdateData(data),
      pdfData: new Uint8Array(pdfBuffer),
      pdfFileName,
      submittedAt: new Date(),
      resumeTokenHash: null,
    },
  });

  const notifyEmail = process.env.NOTIFY_EMAIL ?? "dispatch@chavousllc.com";

  await sendEmail({
    to: notifyEmail,
    subject: `New driver application: ${data.fullName}`,
    html: `
      <h2>New driver application</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Position:</strong> ${data.positionAppliedFor}</p>
      <p><strong>CDL:</strong> Class ${data.cdlClass}, ${data.cdlState}, ${data.yearsExperience} yrs experience</p>
      <p>Full application PDF attached.</p>
    `,
    attachments: [{ filename: pdfFileName, content: pdfBuffer }],
  });

  await sendEmail({
    to: data.email,
    subject: "We received your driver application — Chavous Transportation LLC",
    html: `
      <p>Hi ${data.fullName.split(" ")[0]},</p>
      <p>Thanks for applying to drive with Chavous Transportation LLC. Our hiring team will review your application and reach out if there's a fit.</p>
      <p>A copy of your submitted application is attached for your records.</p>
      <p>— Chavous Transportation LLC</p>
    `,
    attachments: [{ filename: pdfFileName, content: pdfBuffer }],
  });

  return { success: true as const };
}
