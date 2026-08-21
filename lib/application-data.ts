import { encryptField, isMaskedValue } from "@/lib/crypto";
import type { ApplicationInput } from "@/lib/schemas";
import type { Prisma } from "@prisma/client";

export type ApplicationPatch = Partial<ApplicationInput>;

// Shared by the autosave (saveDraftStep) and final-submit actions so both
// apply the same "skip masked sentinel values" rule when writing SSN/bank
// account number — a masked value means the applicant didn't touch that
// field, so the previously-encrypted value already on the row is kept as-is.
export function buildApplicationUpdateData(patch: ApplicationPatch, step?: number): Prisma.DriverApplicationUpdateInput {
  const data: Prisma.DriverApplicationUpdateInput = {};
  if (step !== undefined) data.currentStep = step;

  if (patch.driverType !== undefined) data.driverType = patch.driverType;
  if (patch.fullName !== undefined) data.fullName = patch.fullName;
  if (patch.email !== undefined) data.email = patch.email;
  if (patch.phone !== undefined) data.phone = patch.phone;
  if (patch.ssn !== undefined && !isMaskedValue(patch.ssn)) {
    data.ssnEncrypted = patch.ssn.trim() ? encryptField(patch.ssn) : null;
  }
  if (patch.address !== undefined) data.address = patch.address;
  if (patch.city !== undefined) data.city = patch.city;
  if (patch.state !== undefined) data.state = patch.state.toUpperCase();
  if (patch.zip !== undefined) data.zip = patch.zip;
  if (patch.dateOfBirth !== undefined) data.dateOfBirth = patch.dateOfBirth ? new Date(patch.dateOfBirth) : null;

  if (patch.positionAppliedFor !== undefined) data.positionAppliedFor = patch.positionAppliedFor;
  if (patch.availabilityDate !== undefined)
    data.availabilityDate = patch.availabilityDate ? new Date(patch.availabilityDate) : null;
  if (patch.desiredRoutes !== undefined) data.desiredRoutes = patch.desiredRoutes;
  if (patch.willingToTravel !== undefined) data.willingToTravel = patch.willingToTravel;
  if (patch.eligibleToWork !== undefined) data.eligibleToWork = patch.eligibleToWork;

  if (patch.cdlNumber !== undefined) data.cdlNumber = patch.cdlNumber;
  if (patch.cdlState !== undefined) data.cdlState = patch.cdlState.toUpperCase();
  if (patch.cdlClass !== undefined) data.cdlClass = patch.cdlClass;
  if (patch.cdlEndorsements !== undefined) data.cdlEndorsements = patch.cdlEndorsements;
  if (patch.cdlExpiration !== undefined)
    data.cdlExpiration = patch.cdlExpiration ? new Date(patch.cdlExpiration) : null;
  if (patch.yearsExperience !== undefined) data.yearsExperience = patch.yearsExperience;
  if (patch.equipmentOperated !== undefined) data.equipmentOperated = patch.equipmentOperated;

  if (patch.employmentHistory !== undefined) data.employmentHistory = JSON.stringify(patch.employmentHistory);
  if (patch.hadAccidents !== undefined) data.hadAccidents = patch.hadAccidents;
  if (patch.accidentsExplain !== undefined) data.accidentsExplain = patch.accidentsExplain;
  if (patch.hadViolations !== undefined) data.hadViolations = patch.hadViolations;
  if (patch.violationsExplain !== undefined) data.violationsExplain = patch.violationsExplain;
  if (patch.references !== undefined) data.references = JSON.stringify(patch.references);

  if (patch.bankName !== undefined) data.bankName = patch.bankName;
  if (patch.bankRoutingNumber !== undefined) data.bankRoutingNumber = patch.bankRoutingNumber;
  if (patch.bankAccountNumber !== undefined && !isMaskedValue(patch.bankAccountNumber)) {
    data.bankAccountNumberEncrypted = patch.bankAccountNumber.trim()
      ? encryptField(patch.bankAccountNumber)
      : null;
  }

  if (patch.consentBackgroundCheck !== undefined) data.consentBackgroundCheck = patch.consentBackgroundCheck;
  if (patch.signatureName !== undefined) data.signatureName = patch.signatureName;
  if (patch.signatureDate !== undefined)
    data.signatureDate = patch.signatureDate ? new Date(patch.signatureDate) : null;

  return data;
}
