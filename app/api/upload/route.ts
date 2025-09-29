import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { FileCrypto } from '@/lib/crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const password = formData.get('password') as string

    if (!file || !password) {
      return NextResponse.json(
        { error: 'Missing file or password' },
        { status: 400 }
      )
    }

    // Encrypt the file
    const encryptedFileData = await FileCrypto.encryptFile(file, password)
    
    // Generate unique file ID
    const fileId = FileCrypto.generateFileId()

    // Ensure storage directory exists
    const storageDir = path.join(process.cwd(), 'storage')
    if (!existsSync(storageDir)) {
      await mkdir(storageDir, { recursive: true })
    }

    // Create file metadata
    const metadata = {
      fileId,
      originalName: encryptedFileData.originalName,
      originalType: encryptedFileData.originalType,
      originalSize: encryptedFileData.originalSize,
      salt: Array.from(encryptedFileData.salt),
      iv: Array.from(encryptedFileData.iv),
      encryptedSize: encryptedFileData.encryptedData.byteLength,
      uploadDate: new Date().toISOString()
    }

    // Save encrypted file data
    const encryptedFilePath = path.join(storageDir, `${fileId}.enc`)
    await writeFile(encryptedFilePath, Buffer.from(encryptedFileData.encryptedData))

    // Save metadata
    const metadataPath = path.join(storageDir, `${fileId}.meta.json`)
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2))

    return NextResponse.json({
      success: true,
      fileId,
      originalName: encryptedFileData.originalName,
      originalSize: encryptedFileData.originalSize
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload and encrypt file' },
      { status: 500 }
    )
  }
}