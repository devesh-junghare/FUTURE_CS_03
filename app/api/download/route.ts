import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { FileCrypto } from '@/lib/crypto'

export async function POST(request: NextRequest) {
  try {
    const { fileId, password } = await request.json()

    if (!fileId || !password) {
      return NextResponse.json(
        { error: 'Missing file ID or password' },
        { status: 400 }
      )
    }

    // Check if files exist
    const storageDir = path.join(process.cwd(), 'storage')
    const encryptedFilePath = path.join(storageDir, `${fileId}.enc`)
    const metadataPath = path.join(storageDir, `${fileId}.meta.json`)

    if (!existsSync(encryptedFilePath) || !existsSync(metadataPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Read metadata
    const metadataContent = await readFile(metadataPath, 'utf-8')
    const metadata = JSON.parse(metadataContent)

    // Read encrypted file
    const encryptedData = await readFile(encryptedFilePath)

    try {
      // Reconstruct salt and IV from metadata
      const salt = new Uint8Array(metadata.salt)
      const iv = new Uint8Array(metadata.iv)

      // Decrypt the file
      const decryptedFile = await FileCrypto.decryptFile(
        encryptedData.buffer,
        password,
        salt,
        iv,
        metadata.originalName,
        metadata.originalType
      )

      // Convert the decrypted file to buffer
      const decryptedBuffer = Buffer.from(await decryptedFile.arrayBuffer())

      // Set appropriate headers for file download
      const response = new NextResponse(decryptedBuffer)
      response.headers.set('Content-Type', metadata.originalType || 'application/octet-stream')
      response.headers.set('Content-Disposition', `attachment; filename="${metadata.originalName}"`)
      response.headers.set('Content-Length', decryptedBuffer.length.toString())

      return response

    } catch (decryptError) {
      console.error('Decryption error:', decryptError)
      return NextResponse.json(
        { error: 'Failed to decrypt file. Please check your password.' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    )
  }
}

// Also support GET request for basic file info validation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return NextResponse.json(
        { error: 'Missing file ID' },
        { status: 400 }
      )
    }

    // Check if files exist
    const storageDir = path.join(process.cwd(), 'storage')
    const metadataPath = path.join(storageDir, `${fileId}.meta.json`)

    if (!existsSync(metadataPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Read and return basic metadata (without sensitive info)
    const metadataContent = await readFile(metadataPath, 'utf-8')
    const metadata = JSON.parse(metadataContent)

    return NextResponse.json({
      exists: true,
      originalName: metadata.originalName,
      originalSize: metadata.originalSize,
      uploadDate: metadata.uploadDate
    })

  } catch (error) {
    console.error('File info error:', error)
    return NextResponse.json(
      { error: 'Failed to get file information' },
      { status: 500 }
    )
  }
}