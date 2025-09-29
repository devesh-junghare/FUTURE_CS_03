"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Download, Lock, CheckCircle, XCircle, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DownloadPage() {
  const [fileId, setFileId] = useState("")
  const [decryptionKey, setDecryptionKey] = useState("")
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [fileName, setFileName] = useState("")
  const { toast } = useToast()

  const handleDownload = async () => {
    if (!fileId || !decryptionKey) {
      setTimeout(() => {
        toast({
          title: "Missing Information",
          description: "Please enter both File ID and decryption key.",
          variant: "destructive",
        })
      }, 0)
      return
    }

    setIsDownloading(true)
    setDownloadStatus("idle")
    setErrorMessage("")

    try {
      // First, check if file exists
      const checkResponse = await fetch(`/api/download?fileId=${encodeURIComponent(fileId)}`)
      
      if (!checkResponse.ok) {
        if (checkResponse.status === 404) {
          throw new Error("File not found. Please check your File ID.")
        }
        const errorData = await checkResponse.json()
        throw new Error(errorData.error || "Failed to verify file.")
      }

      const fileInfo = await checkResponse.json()
      setFileName(fileInfo.originalName)

      // Now download and decrypt the file
      const downloadResponse = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: fileId,
          password: decryptionKey
        })
      })

      if (!downloadResponse.ok) {
        const errorData = await downloadResponse.json()
        if (downloadResponse.status === 401) {
          throw new Error("Incorrect decryption key. Please verify your password and try again.")
        } else if (downloadResponse.status === 404) {
          throw new Error("File not found. Please check your File ID.")
        }
        throw new Error(errorData.error || "Failed to download file.")
      }

      // Get the file blob from the response
      const blob = await downloadResponse.blob()
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileInfo.originalName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloadStatus("success")
      setTimeout(() => {
        toast({
          title: "Download Successful",
          description: "Your file has been decrypted and downloaded.",
        })
      }, 0)

    } catch (error) {
      console.error('Download error:', error)
      setDownloadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred.")
      
      setTimeout(() => {
        toast({
          title: "Download Failed",
          description: error instanceof Error ? error.message : "Failed to download file.",
          variant: "destructive",
        })
      }, 0)
    } finally {
      setIsDownloading(false)
    }
  }

  const resetForm = () => {
    setFileId("")
    setDecryptionKey("")
    setDownloadStatus("idle")
    setErrorMessage("")
    setFileName("")
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
                  <Download className="h-4 w-4" />
                </div>
                <h1 className="text-lg font-semibold text-foreground">Download File</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Secure File Download
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File ID Input */}
              <div className="space-y-2">
                <Label htmlFor="file-id">File ID</Label>
                <Input
                  id="file-id"
                  type="text"
                  placeholder="Enter the unique File ID"
                  value={fileId}
                  onChange={(e) => setFileId(e.target.value)}
                  disabled={isDownloading}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  The unique identifier provided when the file was uploaded
                </p>
              </div>

              {/* Decryption Key Input */}
              <div className="space-y-2">
                <Label htmlFor="decryption-key">Decryption Key/Password</Label>
                <Input
                  id="decryption-key"
                  type="password"
                  placeholder="Enter the encryption key"
                  value={decryptionKey}
                  onChange={(e) => setDecryptionKey(e.target.value)}
                  disabled={isDownloading}
                />
                <p className="text-xs text-muted-foreground">
                  The same key that was used to encrypt the file during upload
                </p>
              </div>

              {/* Status Messages */}
              {downloadStatus === "success" && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>Success!</strong> File "{fileName}" has been decrypted and downloaded successfully.
                  </AlertDescription>
                </Alert>
              )}

              {downloadStatus === "error" && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Error:</strong> {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Download Button */}
              <Button
                onClick={handleDownload}
                disabled={!fileId || !decryptionKey || isDownloading}
                className="w-full"
                size="lg"
              >
                {isDownloading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Decrypting & Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download & Decrypt
                  </>
                )}
              </Button>

              {/* Additional Actions */}
              {downloadStatus !== "idle" && (
                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                  <Button onClick={resetForm} variant="outline" className="flex-1 bg-transparent">
                    Download Another File
                  </Button>
                  <Link href="/upload" className="flex-1">
                    <Button variant="secondary" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Files
                    </Button>
                  </Link>
                </div>
              )}

              {/* Security Notice */}
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-foreground">Security Notice</h4>
                    <p className="text-xs text-muted-foreground">
                      Files are decrypted locally in your browser. Your decryption key never leaves your device,
                      ensuring complete privacy and security.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
