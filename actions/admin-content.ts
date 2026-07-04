"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";
import { z } from "zod";

const profileSchema = z.object({
  companyName: z.string().min(2),
  heroHeadline: z.string().min(2),
  heroSubtext: z.string().min(2),
  aboutText: z.string().min(2),
  foundingYear: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
  fleetSize: z.coerce.number().int().min(1),
  dotNumber: z.string().min(1),
  mcNumber: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  dispatchHours: z.string().min(1),
  address: z.string().min(1),
  coverageStates: z.array(z.string().length(2)),
});

export async function updateCompanyProfile(input: z.infer<typeof profileSchema>) {
  await requireAdminSession();
  const data = profileSchema.parse(input);

  await prisma.companyProfile.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
  return { success: true as const };
}

const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  description: z.string().min(2),
  icon: z.enum([
    "truck",
    "boxes",
    "layers",
    "zap",
    "route",
    "package",
    "radar",
  ]),
  category: z.enum([
    "DRY_VAN",
    "FTL",
    "PARTIAL_TRUCKLOAD",
    "LTL",
    "EXPEDITED",
    "DEDICATED_LANES",
    "DISPATCH_TRACKING",
  ]),
  featured: z.boolean(),
  sortOrder: z.coerce.number().int(),
});

export async function upsertService(input: z.infer<typeof serviceSchema>) {
  await requireAdminSession();
  const { id, ...data } = serviceSchema.parse(input);

  const record = id
    ? await prisma.service.update({ where: { id }, data })
    : await prisma.service.create({ data });

  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
  return { success: true as const, id: record.id };
}

export async function deleteService(id: string) {
  await requireAdminSession();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
  return { success: true as const };
}
