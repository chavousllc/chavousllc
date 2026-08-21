/**
 * Builds the fillable AcroForm PDF used as the base "driver application"
 * template. `lib/pdf.ts` loads this file at submission time and fills in
 * the applicant's data. Re-run with `npm run pdf:template` after editing.
 */
import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont, PDFForm } from "pdf-lib";
import { writeFile } from "fs/promises";
import path from "path";
import { PDF_FIELDS } from "../lib/pdf-fields";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const BRAND_RED = rgb(0.86, 0.15, 0.15);
const INK = rgb(0.1, 0.1, 0.12);
const MUTED = rgb(0.4, 0.4, 0.45);

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function main() {
  const doc = await PDFDocument.create();
  doc.setTitle("Chavous Transportation LLC — Driver Employment Application");
  doc.setAuthor("Chavous Transportation LLC");

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const form = doc.getForm();

  function newPage(title: string, pageNum: number, totalPages: number) {
    const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 70, width: PAGE_WIDTH, height: 70, color: BRAND_RED });
    page.drawText("Chavous Transportation LLC", {
      x: MARGIN,
      y: PAGE_HEIGHT - 33,
      size: 16,
      font: bold,
      color: rgb(1, 1, 1),
    });
    page.drawText("Driver Employment Application", {
      x: MARGIN,
      y: PAGE_HEIGHT - 52,
      size: 10,
      font,
      color: rgb(1, 0.9, 0.9),
    });
    page.drawText(`Page ${pageNum} of ${totalPages}`, {
      x: PAGE_WIDTH - MARGIN - 60,
      y: PAGE_HEIGHT - 33,
      size: 9,
      font,
      color: rgb(1, 1, 1),
    });
    page.drawText(title, {
      x: MARGIN,
      y: PAGE_HEIGHT - 95,
      size: 13,
      font: bold,
      color: INK,
    });
    page.drawLine({
      start: { x: MARGIN, y: PAGE_HEIGHT - 102 },
      end: { x: PAGE_WIDTH - MARGIN, y: PAGE_HEIGHT - 102 },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.87),
    });
    return page;
  }

  function label(page: PDFPage, text: string, x: number, y: number, size = 8) {
    page.drawText(text.toUpperCase(), { x, y, size, font: bold, color: MUTED });
  }

  function textField(
    fieldForm: PDFForm,
    page: PDFPage,
    name: string,
    x: number,
    y: number,
    width: number,
    height = 20
  ) {
    const field = fieldForm.createTextField(name);
    field.addToPage(page, { x, y: y - height, width, height, borderWidth: 0.75, borderColor: rgb(0.75, 0.75, 0.78) });
    return field;
  }

  function checkbox(fieldForm: PDFForm, page: PDFPage, name: string, x: number, y: number, size = 14) {
    const field = fieldForm.createCheckBox(name);
    field.addToPage(page, { x, y: y - size, width: size, height: size, borderWidth: 0.75, borderColor: rgb(0.6, 0.6, 0.63) });
    return field;
  }

  const colA = MARGIN;
  const colB = MARGIN + 260;
  const fullWidth = PAGE_WIDTH - MARGIN * 2;

  // ---------- PAGE 1 — Driver Type, Applicant & Position ----------
  let page = newPage("Applicant Information", 1, 4);
  let y = PAGE_HEIGHT - 130;

  label(page, "Driver Type", colA, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.driverType, colA, y, fullWidth);
  y -= 40;

  label(page, "Full Name", colA, y);
  label(page, "Email", colB, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.fullName, colA, y, 230);
  textField(form, page, PDF_FIELDS.email, colB, y, 232);
  y -= 40;

  label(page, "Phone", colA, y);
  label(page, "Date of Birth (MM/DD/YYYY)", colB, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.phone, colA, y, 230);
  textField(form, page, PDF_FIELDS.dateOfBirth, colB, y, 232);
  y -= 40;

  label(page, "Street Address", colA, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.address, colA, y, fullWidth);
  y -= 40;

  label(page, "City", colA, y);
  label(page, "State", colA + 180, y);
  label(page, "ZIP", colA + 320, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.city, colA, y, 160);
  textField(form, page, PDF_FIELDS.state, colA + 180, y, 100);
  textField(form, page, PDF_FIELDS.zip, colA + 320, y, 142);
  y -= 50;

  page.drawText("Position", { x: MARGIN, y, size: 13, font: bold, color: INK });
  y -= 10;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_WIDTH - MARGIN, y }, thickness: 1, color: rgb(0.9, 0.9, 0.92) });
  y -= 24;

  label(page, "Position Applied For", colA, y);
  label(page, "Availability Date", colB, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.positionAppliedFor, colA, y, 230);
  textField(form, page, PDF_FIELDS.availabilityDate, colB, y, 232);
  y -= 40;

  label(page, "Desired Routes / Lanes", colA, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.desiredRoutes, colA, y, fullWidth);
  y -= 36;

  checkbox(form, page, PDF_FIELDS.willingToTravel, colA, y);
  page.drawText("Willing to travel / run OTR", { x: colA + 20, y: y - 11, size: 9, font, color: INK });
  checkbox(form, page, PDF_FIELDS.eligibleToWork, colB, y);
  page.drawText("Legally eligible to work in the U.S.", { x: colB + 20, y: y - 11, size: 9, font, color: INK });

  // ---------- PAGE 2 — CDL, Experience & Employment History ----------
  page = newPage("License, Experience & Employment History", 2, 4);
  y = PAGE_HEIGHT - 130;

  label(page, "CDL Number", colA, y);
  label(page, "CDL State", colB, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.cdlNumber, colA, y, 230);
  textField(form, page, PDF_FIELDS.cdlState, colB, y, 232);
  y -= 40;

  label(page, "CDL Class", colA, y);
  label(page, "Endorsements", colB, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.cdlClass, colA, y, 230);
  textField(form, page, PDF_FIELDS.cdlEndorsements, colB, y, 232);
  y -= 40;

  label(page, "CDL Expiration (MM/DD/YYYY)", colA, y);
  label(page, "Years of Driving Experience", colB, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.cdlExpiration, colA, y, 230);
  textField(form, page, PDF_FIELDS.yearsExperience, colB, y, 232);
  y -= 40;

  label(page, "Equipment Operated", colA, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.equipmentOperated, colA, y, fullWidth);
  y -= 46;

  page.drawText("Employment History (last 3 years)", { x: MARGIN, y, size: 13, font: bold, color: INK });
  y -= 10;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_WIDTH - MARGIN, y }, thickness: 1, color: rgb(0.9, 0.9, 0.92) });
  y -= 24;

  const empRows = [
    { employer: PDF_FIELDS.emp1Employer, position: PDF_FIELDS.emp1Position, from: PDF_FIELDS.emp1From, to: PDF_FIELDS.emp1To, reason: PDF_FIELDS.emp1Reason },
    { employer: PDF_FIELDS.emp2Employer, position: PDF_FIELDS.emp2Position, from: PDF_FIELDS.emp2From, to: PDF_FIELDS.emp2To, reason: PDF_FIELDS.emp2Reason },
    { employer: PDF_FIELDS.emp3Employer, position: PDF_FIELDS.emp3Position, from: PDF_FIELDS.emp3From, to: PDF_FIELDS.emp3To, reason: PDF_FIELDS.emp3Reason },
  ];

  for (const row of empRows) {
    label(page, "Employer", colA, y);
    label(page, "Position", colA + 180, y);
    label(page, "From", colA + 320, y);
    label(page, "To", colA + 400, y);
    y -= 14;
    textField(form, page, row.employer, colA, y, 170);
    textField(form, page, row.position, colA + 180, y, 130);
    textField(form, page, row.from, colA + 320, y, 70);
    textField(form, page, row.to, colA + 400, y, 62);
    y -= 34;
    label(page, "Reason for Leaving", colA, y);
    y -= 14;
    textField(form, page, row.reason, colA, y, fullWidth);
    y -= 36;
  }

  // ---------- PAGE 3 — Driving Record, References, Banking ----------
  page = newPage("Driving Record, References & Banking", 3, 4);
  y = PAGE_HEIGHT - 130;

  checkbox(form, page, PDF_FIELDS.hadAccidents, colA, y);
  page.drawText("I have been in a motor vehicle accident in the last 3 years", {
    x: colA + 20,
    y: y - 11,
    size: 9,
    font,
    color: INK,
  });
  y -= 30;
  label(page, "If yes, explain", colA, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.accidentsExplain, colA, y, fullWidth);
  y -= 40;

  checkbox(form, page, PDF_FIELDS.hadViolations, colA, y);
  page.drawText("I have had a moving violation in the last 3 years", {
    x: colA + 20,
    y: y - 11,
    size: 9,
    font,
    color: INK,
  });
  y -= 30;
  label(page, "If yes, explain", colA, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.violationsExplain, colA, y, fullWidth);
  y -= 46;

  page.drawText("References", { x: MARGIN, y, size: 13, font: bold, color: INK });
  y -= 10;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_WIDTH - MARGIN, y }, thickness: 1, color: rgb(0.9, 0.9, 0.92) });
  y -= 24;

  const refRows = [
    { name: PDF_FIELDS.ref1Name, relationship: PDF_FIELDS.ref1Relationship, phone: PDF_FIELDS.ref1Phone },
    { name: PDF_FIELDS.ref2Name, relationship: PDF_FIELDS.ref2Relationship, phone: PDF_FIELDS.ref2Phone },
    { name: PDF_FIELDS.ref3Name, relationship: PDF_FIELDS.ref3Relationship, phone: PDF_FIELDS.ref3Phone },
  ];
  for (const row of refRows) {
    label(page, "Name", colA, y);
    label(page, "Relationship", colA + 180, y);
    label(page, "Phone", colA + 340, y);
    y -= 14;
    textField(form, page, row.name, colA, y, 170);
    textField(form, page, row.relationship, colA + 180, y, 150);
    textField(form, page, row.phone, colA + 340, y, 122);
    y -= 32;
  }

  y -= 14;
  page.drawText("Banking (Direct Deposit)", { x: MARGIN, y, size: 13, font: bold, color: INK });
  y -= 10;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_WIDTH - MARGIN, y }, thickness: 1, color: rgb(0.9, 0.9, 0.92) });
  y -= 24;

  label(page, "Bank Name", colA, y);
  label(page, "Routing Number", colB, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.bankName, colA, y, 230);
  textField(form, page, PDF_FIELDS.bankRoutingNumber, colB, y, 232);
  y -= 40;

  label(page, "Account Number", colA, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.bankAccountNumberMasked, colA, y, 230);
  page.drawText("Full account number is on file in the admin portal only.", {
    x: colA + 240,
    y: y + 4,
    size: 8,
    font,
    color: MUTED,
  });

  // ---------- PAGE 4 — Consent & Certification ----------
  page = newPage("Consent & Certification", 4, 4);
  y = PAGE_HEIGHT - 130;

  const consentText =
    "I certify that the information provided in this application is true and complete to the best of my knowledge. " +
    "I understand that any false statements or omissions may disqualify me from employment or result in termination. " +
    "I authorize Chavous Transportation LLC to verify my driving record, employment history, and to conduct a background " +
    "and motor vehicle report (MVR) check as permitted by the Fair Credit Reporting Act and applicable FMCSA regulations.";
  for (const line of wrapText(consentText, font, 9, fullWidth)) {
    page.drawText(line, { x: MARGIN, y, size: 9, font, color: MUTED });
    y -= 13;
  }
  y -= 10;

  checkbox(form, page, PDF_FIELDS.consentBackgroundCheck, colA, y);
  page.drawText("I have read and agree to the statement above", {
    x: colA + 20,
    y: y - 11,
    size: 9,
    font,
    color: INK,
  });
  y -= 40;

  label(page, "Signature (type full name)", colA, y);
  label(page, "Date", colB, y);
  y -= 14;
  textField(form, page, PDF_FIELDS.signatureName, colA, y, 230);
  textField(form, page, PDF_FIELDS.signatureDate, colB, y, 232);

  // Cosmetic defaults for text fields
  form.getFields().forEach((field) => {
    if ("setFontSize" in field) {
      // @ts-expect-error — narrowed at runtime by pdf-lib for text fields
      field.setFontSize(10);
    }
  });

  const bytes = await doc.save();
  const outPath = path.join(process.cwd(), "public/forms/driver-application-template.pdf");
  await writeFile(outPath, bytes);
  console.log(`Wrote ${outPath} (${bytes.length} bytes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
