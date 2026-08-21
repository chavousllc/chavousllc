import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// AES-256-GCM field-level encryption for sensitive application data (SSN,
// bank account number). Stored as "iv:authTag:ciphertext" (base64 segments).
function getKey(): Buffer {
  const raw = process.env.APPLICATION_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("APPLICATION_ENCRYPTION_KEY is not set");
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("APPLICATION_ENCRYPTION_KEY must be a base64-encoded 32-byte key");
  }
  return key;
}

export function encryptField(plainText: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("base64"), authTag.toString("base64"), ciphertext.toString("base64")].join(":");
}

export function decryptField(stored: string): string {
  const [ivB64, authTagB64, ciphertextB64] = stored.split(":");
  if (!ivB64 || !authTagB64 || !ciphertextB64) {
    throw new Error("Malformed encrypted field");
  }
  const decipher = createDecipheriv("aes-256-gcm", getKey(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(authTagB64, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertextB64, "base64")),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}

export function maskSSN(ssn: string): string {
  const digits = ssn.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return `•••-••-${last4.padStart(4, "•")}`;
}

export function maskAccountNumber(accountNumber: string): string {
  const digits = accountNumber.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return `•••• ${last4.padStart(4, "•")}`;
}

// maskSSN/maskAccountNumber both use the bullet character, which never
// appears in real user input — the save action treats any field still
// containing one as "unchanged" and leaves the existing encrypted value alone.
export function isMaskedValue(value: string | undefined | null): boolean {
  return !!value && value.includes("•");
}
