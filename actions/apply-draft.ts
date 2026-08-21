"use server";

import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { decryptField, maskSSN, maskAccountNumber } from "@/lib/crypto";
import { buildApplicationUpdateData, type ApplicationPatch } from "@/lib/application-data";
import { DOCUMENT_TYPES } from "@/lib/schemas";
import { ApplicationDocumentType } from "@prisma/client";
import { findDraftByResumeToken, hashToken, generateApplicationCode } from "@/lib/apply-draft-lookup";

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_DOCUMENT_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const DOCUMENT_TYPE_VALUES = new Set<string>(DOCUMENT_TYPES.map((d) => d.value));

export async function startDraftApplication() {
  const resumeToken = randomBytes(32).toString("hex");
  const draft = await prisma.driverApplication.create({
    data: {
      applicationCode: generateApplicationCode(),
      resumeTokenHash: hashToken(resumeToken),
    },
  });
  return {
    id: draft.id,
    applicationCode: draft.applicationCode,
    resumeToken,
  };
}

function toDateInputValue(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export async function loadDraftApplication(resumeToken: string) {
  const draft = await findDraftByResumeToken(resumeToken);
  if (!draft) return { success: false as const, error: "This application could not be found." };

  const employmentHistory = draft.employmentHistory ? JSON.parse(draft.employmentHistory) : undefined;
  const references = draft.references ? JSON.parse(draft.references) : undefined;

  return {
    success: true as const,
    applicationCode: draft.applicationCode,
    currentStep: draft.currentStep,
    documents: draft.documents.map((d) => ({ id: d.id, type: d.type, fileName: d.fileName, size: d.size })),
    data: {
      driverType: draft.driverType ?? undefined,
      fullName: draft.fullName ?? "",
      email: draft.email ?? "",
      phone: draft.phone ?? "",
      ssn: draft.ssnEncrypted ? maskSSN(decryptField(draft.ssnEncrypted)) : "",
      address: draft.address ?? "",
      city: draft.city ?? "",
      state: draft.state ?? "",
      zip: draft.zip ?? "",
      dateOfBirth: toDateInputValue(draft.dateOfBirth),
      positionAppliedFor: draft.positionAppliedFor ?? "",
      availabilityDate: toDateInputValue(draft.availabilityDate),
      desiredRoutes: draft.desiredRoutes ?? "",
      willingToTravel: draft.willingToTravel ?? true,
      eligibleToWork: draft.eligibleToWork ?? true,
      cdlNumber: draft.cdlNumber ?? "",
      cdlState: draft.cdlState ?? "",
      cdlClass: draft.cdlClass ?? "",
      cdlEndorsements: draft.cdlEndorsements ?? "",
      cdlExpiration: toDateInputValue(draft.cdlExpiration),
      yearsExperience: draft.yearsExperience ?? 0,
      equipmentOperated: draft.equipmentOperated ?? "",
      employmentHistory,
      hadAccidents: draft.hadAccidents ?? false,
      accidentsExplain: draft.accidentsExplain ?? "",
      hadViolations: draft.hadViolations ?? false,
      violationsExplain: draft.violationsExplain ?? "",
      references,
      bankName: draft.bankName ?? "",
      bankRoutingNumber: draft.bankRoutingNumber ?? "",
      bankAccountNumber: draft.bankAccountNumberEncrypted
        ? maskAccountNumber(decryptField(draft.bankAccountNumberEncrypted))
        : "",
      consentBackgroundCheck: draft.consentBackgroundCheck ?? false,
      signatureName: draft.signatureName ?? "",
      signatureDate: toDateInputValue(draft.signatureDate),
    },
  };
}

export async function saveDraftStep(resumeToken: string, step: number, patch: ApplicationPatch) {
  const draft = await findDraftByResumeToken(resumeToken);
  if (!draft) return { success: false as const, error: "This application could not be found." };

  await prisma.driverApplication.update({
    where: { id: draft.id },
    data: buildApplicationUpdateData(patch, step),
  });
  return { success: true as const };
}

export async function uploadApplicationDocument(resumeToken: string, formData: FormData) {
  const draft = await findDraftByResumeToken(resumeToken);
  if (!draft) return { success: false as const, error: "This application could not be found." };

  const type = formData.get("type");
  const file = formData.get("file");
  if (typeof type !== "string" || !DOCUMENT_TYPE_VALUES.has(type)) {
    return { success: false as const, error: "Invalid document type." };
  }
  if (!(file instanceof File)) {
    return { success: false as const, error: "No file provided." };
  }
  if (file.size > MAX_DOCUMENT_SIZE) {
    return { success: false as const, error: "File is too large (max 10MB)." };
  }
  if (!ALLOWED_DOCUMENT_TYPES.has(file.type)) {
    return { success: false as const, error: "Only PDF, JPG, and PNG files are accepted." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const document = await prisma.applicationDocument.create({
    data: {
      applicationId: draft.id,
      type: type as ApplicationDocumentType,
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      data: bytes,
    },
  });

  return {
    success: true as const,
    document: { id: document.id, type: document.type, fileName: document.fileName, size: document.size },
  };
}

export async function deleteApplicationDocument(resumeToken: string, documentId: string) {
  const draft = await findDraftByResumeToken(resumeToken);
  if (!draft) return { success: false as const, error: "This application could not be found." };

  await prisma.applicationDocument.deleteMany({ where: { id: documentId, applicationId: draft.id } });
  return { success: true as const };
}
