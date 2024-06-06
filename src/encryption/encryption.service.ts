// src/encryption/encryption.service.ts
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EncryptionService {
  private privateKey: string;
  private publicKey: string;

  constructor() {
    this.privateKey = fs.readFileSync(
      path.resolve(__dirname, '../../private.pem'),
      'utf8',
    );
    this.publicKey = fs.readFileSync(
      path.resolve(__dirname, '../../public.pem'),
      'utf8',
    );
  }

  encryptData(payload: string) {
    const aesKey = crypto.randomBytes(32);

    const data2 = this.aesEncrypt(payload, aesKey);
    const data1 = this.rsaEncrypt(aesKey.toString('base64'), this.publicKey);

    return {
      successful: true,
      error_code: '',
      data: {
        data1: data1,
        data2: data2,
      },
    };
  }

  decryptData(data1: string, data2: string) {
    const aesKey = Buffer.from(
      this.rsaDecrypt(data1, this.privateKey),
      'base64',
    );
    const payload = this.aesDecrypt(data2, aesKey);

    return {
      successful: true,
      error_code: '',
      data: {
        payload: payload,
      },
    };
  }

  private aesEncrypt(text: string, key: Buffer): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
  }

  private aesDecrypt(text: string, key: Buffer): string {
    const iv = Buffer.from(text.slice(0, 32), 'hex');
    const encryptedText = Buffer.from(text.slice(32), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  }

  private rsaEncrypt(text: string, key: string): string {
    return crypto.publicEncrypt(key, Buffer.from(text)).toString('base64');
  }

  private rsaDecrypt(text: string, key: string): string {
    return crypto
      .privateDecrypt(key, Buffer.from(text, 'base64'))
      .toString('utf8');
  }
}
