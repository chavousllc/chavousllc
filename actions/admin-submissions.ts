"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";
import { SubmissionStatus } from "@/app/generated/prisma/client";

export async function updateApplicationStatus(id: string, status: SubmissionStatus) {
  await requireAdminSession();
  await prisma.driverApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/applications");
  return { success: true as const };
}

export async function updateQuoteStatus(id: string, status: SubmissionStatus) {
  await requireAdminSession();
  await prisma.quoteRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/quotes");
  return { success: true as const };
}

export async function updateMessageStatus(id: string, status: SubmissionStatus) {
  await requireAdminSession();
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidatePath("/admin/messages");
  return { success: true as const };
}
