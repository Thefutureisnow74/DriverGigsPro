import crypto from 'crypto';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
const ALGORITHM = 'aes-256-gcm';

export class EncryptionService {
  static encrypt(text: string): string {
    try {
      return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  static decrypt(encryptedText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  static encryptTokens(tokens: { accessToken?: string; refreshToken?: string }) {
    return {
      accessToken: tokens.accessToken ? this.encrypt(tokens.accessToken) : null,
      refreshToken: tokens.refreshToken ? this.encrypt(tokens.refreshToken) : null,
    };
  }

  static decryptTokens(encryptedTokens: { accessToken?: string | null; refreshToken?: string | null }) {
    return {
      accessToken: encryptedTokens.accessToken ? this.decrypt(encryptedTokens.accessToken) : null,
      refreshToken: encryptedTokens.refreshToken ? this.decrypt(encryptedTokens.refreshToken) : null,
    };
  }

  static generateSecureHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static generateRandomToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
}