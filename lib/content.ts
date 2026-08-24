import { prisma } from "@/lib/prisma";
import type { CompanyProfile, Service } from "@prisma/client";

export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  id: "main",
  companyName: "Chavous Transportation LLC",
  heroHeadline: "Reliable Freight Transportation, Coast to Coast",
  heroSubtext:
    "Chavous Transportation LLC moves freight across the continental United States with a modern fleet and a safety-first team you can count on.",
  aboutText:
    "Chavous Transportation LLC is a mid-size carrier built on reliability, safety, and communication. Our team of experienced drivers and dispatchers works around the clock to keep your freight moving on time, every time.",
  foundingYear: 2022,
  fleetSize: 35,
  dotNumber: "U.S. DOT# 3872584",
  mcNumber: "MC-1418287-C",
  phone: "+1 (513) 877-0111",
  email: "dispatch@chavousllc.com",
  dispatchHours: "Mon - Fri, 8:00 AM – 5:00 PM EST",
  address: "1112 Harper Dr, Warminster, PA 18974",
  coverageStates: [
    "AL","AZ","AR","CA","CO","CT","DE","FL","GA","ID","IL","IN","IA","KS","KY",
    "LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
    "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA",
    "WV","WI","WY",
  ],
  updatedAt: new Date(),
};

// Falls back to sane defaults if the database isn't reachable yet (e.g. before
// the real Supabase credentials are configured) so the site still renders.
export async function getCompanyProfile(): Promise<CompanyProfile> {
  try {
    const profile = await prisma.companyProfile.findUnique({
      where: { id: "main" },
    });
    return profile ?? DEFAULT_COMPANY_PROFILE;
  } catch {
    return DEFAULT_COMPANY_PROFILE;
  }
}

// Mirrors prisma/seed.ts — kept as a fallback so the Services section still
// renders real content before the database is connected and seeded.
const now = new Date();
function defaultService(
  i: number,
  title: string,
  description: string,
  icon: string,
  category: Service["category"],
  featured: boolean
): Service {
  return {
    id: `default-${i}`,
    title,
    description,
    icon,
    category,
    featured,
    sortOrder: i,
    createdAt: now,
    updatedAt: now,
  };
}

export const DEFAULT_SERVICES: Service[] = [
  defaultService(0, "Dry Van", "Standard enclosed trailers for palletized, boxed, and general freight — our primary equipment type, running nationwide lanes every day.", "truck", "DRY_VAN", true),
  defaultService(1, "FTL (Full Truckload)", "A dedicated trailer for your freight alone — no stops, no sharing space, fastest transit from pickup to delivery.", "boxes", "FTL", true),
  defaultService(2, "Partial Truckload", "Freight that's too big for LTL but doesn't need a full trailer — priced and routed for shipments in between.", "layers", "PARTIAL_TRUCKLOAD", false),
  defaultService(3, "LTL (Less Than Truckload)", "Cost-effective shipping for smaller loads that don't need a full trailer, consolidated and routed efficiently.", "package", "LTL", false),
  defaultService(4, "Expedited Freight", "Time-critical loads with dedicated drivers and priority scheduling when your shipment can't wait.", "zap", "EXPEDITED", true),
  defaultService(5, "Dedicated Lanes", "Recurring contracted routes with consistent capacity and predictable transit times for regular shippers.", "route", "DEDICATED_LANES", true),
  defaultService(6, "24/7 Dispatch & Tracking", "Real-time load tracking and a dispatch team on call around the clock, so you always know where your freight stands.", "radar", "DISPATCH_TRACKING", false),
];

export async function getServices(): Promise<Service[]> {
  try {
    const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
    return services.length > 0 ? services : DEFAULT_SERVICES;
  } catch {
    return DEFAULT_SERVICES;
  }
}
