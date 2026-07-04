"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { fillDriverApplicationPdf } from "@/lib/pdf";
import { applicationSchema, type ApplicationInput } from "@/lib/schemas";

export async function submitDriverApplication(input: ApplicationInput) {
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  const pdfBuffer = await fillDriverApplicationPdf(data);
  const pdfFileName = `driver-application-${data.fullName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`;

  await prisma.driverApplication.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state.toUpperCase(),
      zip: data.zip,
      dateOfBirth: new Date(data.dateOfBirth),

      positionAppliedFor: data.positionAppliedFor,
      availabilityDate: new Date(data.availabilityDate),
      desiredRoutes: data.desiredRoutes,
      willingToTravel: data.willingToTravel,
      eligibleToWork: data.eligibleToWork,

      cdlNumber: data.cdlNumber,
      cdlState: data.cdlState.toUpperCase(),
      cdlClass: data.cdlClass,
      cdlEndorsements: data.cdlEndorsements ?? "",
      cdlExpiration: new Date(data.cdlExpiration),
      yearsExperience: data.yearsExperience,
      equipmentOperated: data.equipmentOperated,

      employmentHistory: JSON.stringify(data.employmentHistory),
      hadAccidents: data.hadAccidents,
      accidentsExplain: data.accidentsExplain ?? "",
      hadViolations: data.hadViolations,
      violationsExplain: data.violationsExplain ?? "",
      references: JSON.stringify(data.references),

      consentBackgroundCheck: data.consentBackgroundCheck,
      signatureName: data.signatureName,
      signatureDate: new Date(data.signatureDate),

      pdfData: new Uint8Array(pdfBuffer),
      pdfFileName,
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
