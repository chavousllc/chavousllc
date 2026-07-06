"use server";

import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/lib/schemas";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// Always returns success (even if the email doesn't match an account) so the
// form can't be used to enumerate valid admin emails.
export async function requestPasswordReset(input: ForgotPasswordInput) {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { email } = parsed.data;

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (admin) {
    const rawToken = randomBytes(32).toString("hex");
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        resetTokenHash: hashToken(rawToken),
        resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/admin/reset-password?token=${rawToken}`;
    await sendEmail({
      to: email,
      subject: "Reset your Chavous Transportation admin password",
      html: `
        <p>We received a request to reset the admin password for this account.</p>
        <p><a href="${resetUrl}">Click here to set a new password</a> — this link expires in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
  }

  return { success: true as const };
}

export async function resetPassword(input: ResetPasswordInput) {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { token, password } = parsed.data;

  const admin = await prisma.adminUser.findUnique({
    where: { resetTokenHash: hashToken(token) },
  });

  if (!admin || !admin.resetTokenExpiresAt || admin.resetTokenExpiresAt < new Date()) {
    return { success: false as const, error: "This reset link is invalid or has expired." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
  });

  return { success: true as const };
}
