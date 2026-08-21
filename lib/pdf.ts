import { PDFDocument, PDFCheckBox, PDFTextField } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import { PDF_FIELDS } from "@/lib/pdf-fields";
import { maskAccountNumber } from "@/lib/crypto";
import { DRIVER_TYPES, type ApplicationInput } from "@/lib/schemas";

function fmtDate(value: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export async function fillDriverApplicationPdf(data: ApplicationInput): Promise<Buffer> {
  const templatePath = path.join(process.cwd(), "public/forms/driver-application-template.pdf");
  const templateBytes = await readFile(templatePath);
  const doc = await PDFDocument.load(templateBytes);
  const form = doc.getForm();

  function setText(name: string, value: string) {
    const field = form.getField(name);
    if (field instanceof PDFTextField) field.setText(value ?? "");
  }

  function setChecked(name: string, value: boolean) {
    const field = form.getField(name);
    if (field instanceof PDFCheckBox) {
      if (value) field.check();
      else field.uncheck();
    }
  }

  const driverTypeLabel = DRIVER_TYPES.find((d) => d.value === data.driverType)?.label ?? data.driverType;
  setText(PDF_FIELDS.driverType, driverTypeLabel);

  setText(PDF_FIELDS.fullName, data.fullName);
  setText(PDF_FIELDS.email, data.email);
  setText(PDF_FIELDS.phone, data.phone);
  setText(PDF_FIELDS.dateOfBirth, fmtDate(data.dateOfBirth));
  setText(PDF_FIELDS.address, data.address);
  setText(PDF_FIELDS.city, data.city);
  setText(PDF_FIELDS.state, data.state.toUpperCase());
  setText(PDF_FIELDS.zip, data.zip);

  setText(PDF_FIELDS.positionAppliedFor, data.positionAppliedFor);
  setText(PDF_FIELDS.availabilityDate, fmtDate(data.availabilityDate));
  setText(PDF_FIELDS.desiredRoutes, data.desiredRoutes);
  setChecked(PDF_FIELDS.willingToTravel, data.willingToTravel);
  setChecked(PDF_FIELDS.eligibleToWork, data.eligibleToWork);

  setText(PDF_FIELDS.cdlNumber, data.cdlNumber);
  setText(PDF_FIELDS.cdlState, data.cdlState.toUpperCase());
  setText(PDF_FIELDS.cdlClass, data.cdlClass);
  setText(PDF_FIELDS.cdlEndorsements, data.cdlEndorsements ?? "");
  setText(PDF_FIELDS.cdlExpiration, fmtDate(data.cdlExpiration));
  setText(PDF_FIELDS.yearsExperience, String(data.yearsExperience));
  setText(PDF_FIELDS.equipmentOperated, data.equipmentOperated);

  const empFieldKeys = [
    ["emp1Employer", "emp1Position", "emp1From", "emp1To", "emp1Reason"],
    ["emp2Employer", "emp2Position", "emp2From", "emp2To", "emp2Reason"],
    ["emp3Employer", "emp3Position", "emp3From", "emp3To", "emp3Reason"],
  ] as const;
  data.employmentHistory.slice(0, 3).forEach((entry, i) => {
    const [employerKey, positionKey, fromKey, toKey, reasonKey] = empFieldKeys[i];
    setText(PDF_FIELDS[employerKey], entry.employer ?? "");
    setText(PDF_FIELDS[positionKey], entry.position ?? "");
    setText(PDF_FIELDS[fromKey], entry.from ?? "");
    setText(PDF_FIELDS[toKey], entry.to ?? "");
    setText(PDF_FIELDS[reasonKey], entry.reasonForLeaving ?? "");
  });

  setChecked(PDF_FIELDS.hadAccidents, data.hadAccidents);
  setText(PDF_FIELDS.accidentsExplain, data.accidentsExplain ?? "");
  setChecked(PDF_FIELDS.hadViolations, data.hadViolations);
  setText(PDF_FIELDS.violationsExplain, data.violationsExplain ?? "");

  const refFieldKeys = [
    ["ref1Name", "ref1Relationship", "ref1Phone"],
    ["ref2Name", "ref2Relationship", "ref2Phone"],
    ["ref3Name", "ref3Relationship", "ref3Phone"],
  ] as const;
  data.references.slice(0, 3).forEach((entry, i) => {
    const [nameKey, relKey, phoneKey] = refFieldKeys[i];
    setText(PDF_FIELDS[nameKey], entry.name ?? "");
    setText(PDF_FIELDS[relKey], entry.relationship ?? "");
    setText(PDF_FIELDS[phoneKey], entry.phone ?? "");
  });

  setText(PDF_FIELDS.bankName, data.bankName);
  setText(PDF_FIELDS.bankRoutingNumber, data.bankRoutingNumber);
  setText(PDF_FIELDS.bankAccountNumberMasked, maskAccountNumber(data.bankAccountNumber));

  setChecked(PDF_FIELDS.consentBackgroundCheck, data.consentBackgroundCheck);
  setText(PDF_FIELDS.signatureName, data.signatureName);
  setText(PDF_FIELDS.signatureDate, fmtDate(data.signatureDate));

  form.flatten();

  const bytes = await doc.save();
  return Buffer.from(bytes);
}
