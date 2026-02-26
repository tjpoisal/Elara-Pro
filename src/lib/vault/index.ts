import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.FORMULA_VAULT_KEY;
  if (!key) throw new Error('FORMULA_VAULT_KEY environment variable is not set');
  return Buffer.from(key, 'hex');
}

export interface EncryptedPayload {
  encryptedData: string;
  iv: string;
  tag: string;
}

/** Encrypt data using AES-256-GCM */
export function encrypt(plaintext: string): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const tag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  };
}

/** Decrypt data using AES-256-GCM */
export function decrypt(payload: EncryptedPayload): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(payload.iv, 'hex');
  const tag = Buffer.from(payload.tag, 'hex');
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(payload.encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/** Encrypt a formula object for vault storage */
export function encryptFormula(formulaData: Record<string, unknown>): EncryptedPayload {
  return encrypt(JSON.stringify(formulaData));
}

/** Decrypt a formula from vault storage */
export function decryptFormula(payload: EncryptedPayload): Record<string, unknown> {
  const decrypted = decrypt(payload);
  return JSON.parse(decrypted) as Record<string, unknown>;
}
