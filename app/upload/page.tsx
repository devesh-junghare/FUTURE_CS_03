"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Upload, Lock, Copy, CheckCircle, AlertCircle, FileText, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [encryptionKey, setEncryptionKey] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileId, setFileId] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const generateFileId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  const handleUpload = async () => {
    if (!file || !encryptionKey) {
      setTimeout(() => {
        toast({
          title: "Missing Information",
          description: "Please select a file and enter an encryption key.",
          variant: "destructive",
        })
      }, 0)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = Math.min(90, prev + Math.random() * 10)
          return newProgress
        })
      }, 100)

      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', encryptionKey)

      // Upload file
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      
      setIsUploading(false)
      setIsSuccess(true)
      setFileId(result.fileId)
      
      setTimeout(() => {
        toast({
          title: "Upload Successful",
          description: "Your file has been encrypted and uploaded securely.",
        })
      }, 0)

    } catch (error) {
      console.error('Upload error:', error)
      setIsUploading(false)
      setUploadProgress(0)
      
      setTimeout(() => {
        toast({
          title: "Upload Failed",
          description: error instanceof Error ? error.message : "Failed to upload and encrypt file.",
          variant: "destructive",
        })
      }, 0)
    }
  }

  const copyFileId = () => {
    navigator.clipboard.writeText(fileId)
    setTimeout(() => {
      toast({
        title: "Copied!",
        description: "File ID copied to clipboard.",
      })
    }, 0)
  }

  const resetForm = () => {
    setFile(null)
    setEncryptionKey("")
    setIsUploading(false)
    setUploadProgress(0)
    setFileId("")
    setIsSuccess(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Upload className="h-4 w-4" />
                </div>
                <h1 className="text-lg font-semibold text-foreground">Upload File</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {!isSuccess ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Secure File Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload Area */}
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Select File</Label>
                  <div
                    className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                      dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      {file ? (
                        <div>
                          <p className="font-medium text-foreground">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-foreground">
                            Drag and drop your file here, or click to browse
                          </p>
                          <p className="text-sm text-muted-foreground">All file types supported</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Encryption Key */}
                <div className="space-y-2">
                  <Label htmlFor="encryption-key">Encryption Key/Password</Label>
                  <Input
                    id="encryption-key"
                    type="password"
                    placeholder="Enter a strong encryption key"
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                    disabled={isUploading}
                  />
                  <p className="text-xs text-muted-foreground">
                    This key will be required to decrypt and download your file. Keep it safe!
                  </p>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Upload Progress</Label>
                      <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  disabled={!file || !encryptionKey || isUploading}
                  className="w-full"
                  size="lg"
                >
                  {isUploading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Encrypting & Uploading...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Encrypt & Upload
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Success State */
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <h2 className="mb-2 text-2xl font-bold text-foreground">Upload Successful!</h2>
                <p className="mb-6 text-muted-foreground">Your file has been encrypted and uploaded securely.</p>

                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Save your File ID and encryption key. You'll need both to download your
                    file.
                  </AlertDescription>
                </Alert>

                <div className="mb-6 space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <Label className="text-sm font-medium">File ID</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="flex-1 rounded bg-background px-3 py-2 text-sm font-mono">{fileId}</code>
                      <Button size="sm" variant="outline" onClick={copyFileId}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button onClick={resetForm} variant="outline" className="flex-1 bg-transparent">
                    Upload Another File
                  </Button>
                  <Link href="/download" className="flex-1">
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Files
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
