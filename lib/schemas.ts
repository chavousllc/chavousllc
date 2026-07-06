import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string(),
  message: z.string().min(10, "Tell us a bit more (10+ characters)"),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const EQUIPMENT_TYPES = [
  { value: "DRY_VAN", label: "Dry Van" },
  { value: "REEFER", label: "Refrigerated (Reefer)" },
  { value: "FLATBED", label: "Flatbed" },
  { value: "EXPEDITED", label: "Expedited" },
] as const;

export const LOAD_TYPES = [
  { value: "FTL", label: "Full Truckload (FTL)" },
  { value: "LTL", label: "Less Than Truckload (LTL)" },
] as const;

export const quoteSchema = z.object({
  shipperCompany: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  originCity: z.string().min(1, "Origin city is required"),
  originState: z.string().length(2, "Use a 2-letter state code"),
  destCity: z.string().min(1, "Destination city is required"),
  destState: z.string().length(2, "Use a 2-letter state code"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  equipmentType: z.enum(["DRY_VAN", "REEFER", "FLATBED", "EXPEDITED"]),
  loadType: z.enum(["FTL", "LTL"]),
  weight: z.number().int().positive("Enter a weight in lbs"),
  commodity: z.string().min(2, "Describe the commodity"),
  notes: z.string(),
});
export type QuoteInput = z.infer<typeof quoteSchema>;

const employmentEntrySchema = z.object({
  employer: z.string(),
  position: z.string(),
  from: z.string(),
  to: z.string(),
  reasonForLeaving: z.string(),
});

const referenceEntrySchema = z.object({
  name: z.string(),
  relationship: z.string(),
  phone: z.string(),
});

export const applicationSchema = z.object({
  // Applicant
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  address: z.string().min(2, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "Use a 2-letter state code"),
  zip: z.string().min(4, "Enter a valid ZIP code"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),

  // Position
  positionAppliedFor: z.string().min(2, "Position is required"),
  availabilityDate: z.string().min(1, "Availability date is required"),
  desiredRoutes: z.string().min(2, "Describe your preferred routes/lanes"),
  willingToTravel: z.boolean(),
  eligibleToWork: z.boolean(),

  // CDL / experience
  cdlNumber: z.string().min(2, "CDL number is required"),
  cdlState: z.string().length(2, "Use a 2-letter state code"),
  cdlClass: z.string().min(1, "CDL class is required"),
  cdlEndorsements: z.string(),
  cdlExpiration: z.string().min(1, "CDL expiration date is required"),
  yearsExperience: z.number().int().min(0, "Enter years of experience"),
  equipmentOperated: z.string().min(2, "List equipment you've operated"),

  // Employment history (last 3 years) — 3 fixed rows, first required
  employmentHistory: z.tuple([
    employmentEntrySchema,
    employmentEntrySchema,
    employmentEntrySchema,
  ]),

  hadAccidents: z.boolean(),
  accidentsExplain: z.string(),
  hadViolations: z.boolean(),
  violationsExplain: z.string(),

  // References — 3 fixed rows
  references: z.tuple([
    referenceEntrySchema,
    referenceEntrySchema,
    referenceEntrySchema,
  ]),

  consentBackgroundCheck: z.boolean().refine((v) => v === true, {
    message: "You must consent to a background/MVR check to apply",
  }),
  signatureName: z.string().min(2, "Type your full name as signature"),
  signatureDate: z.string().min(1, "Date is required"),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;
