// Crypto utilities for file encryption and decryption
export class FileCrypto {
  /**
   * Derives a key from a password using PBKDF2
   */
  private static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    )

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Encrypts a file using AES-GCM
   */
  static async encryptFile(file: File, password: string): Promise<{
    encryptedData: ArrayBuffer
    salt: Uint8Array
    iv: Uint8Array
    originalName: string
    originalType: string
    originalSize: number
  }> {
    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))

    // Derive key from password
    const key = await this.deriveKey(password, salt)

    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer()

    // Encrypt the file data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      fileBuffer
    )

    return {
      encryptedData,
      salt,
      iv,
      originalName: file.name,
      originalType: file.type,
      originalSize: file.size
    }
  }

  /**
   * Decrypts a file using AES-GCM
   */
  static async decryptFile(
    encryptedData: ArrayBuffer,
    password: string,
    salt: Uint8Array,
    iv: Uint8Array,
    originalName: string,
    originalType: string
  ): Promise<File> {
    try {
      // Derive key from password
      const key = await this.deriveKey(password, salt)

      // Decrypt the data
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encryptedData
      )

      // Create and return a new File object
      return new File([decryptedData], originalName, { type: originalType })
    } catch (error) {
      throw new Error('Failed to decrypt file. Please check your password.')
    }
  }

  /**
   * Generates a unique file ID
   */
  static generateFileId(): string {
    return crypto.getRandomValues(new Uint32Array(4))
      .reduce((acc, val) => acc + val.toString(36), '')
  }
}