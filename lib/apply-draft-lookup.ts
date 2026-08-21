import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateApplicationCode() {
  const random = randomBytes(4).toString("hex").toUpperCase();
  return `APP-${Date.now()}-${random}`;
}

// A draft is any application row that hasn't been finally submitted yet — the
// resume token hash is the only credential needed to read or mutate it, same
// trust model as the admin password-reset token flow.
export function findDraftByResumeToken(resumeToken: string) {
  return prisma.driverApplication.findUnique({
    where: { resumeTokenHash: hashToken(resumeToken), submittedAt: null },
    include: { documents: true },
  });
}
