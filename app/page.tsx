import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Upload, Download, Lock, Shield, Key, FileText } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Lock className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">SecureShare</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Shield className="mr-2 h-4 w-4" />
                Security Info
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <Lock className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <span className="text-balance">🔒 Secure File Sharing System</span>
          </h1>

          <p className="mb-12 text-xl text-muted-foreground sm:text-2xl">
            <span className="text-balance">Upload, encrypt, and share your files securely with AES encryption.</span>
          </p>

          {/* Action Buttons */}
          <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/upload">
              <Button size="lg" className="w-full sm:w-auto">
                <Upload className="mr-2 h-5 w-5" />
                Upload File
              </Button>
            </Link>
            <Link href="/download">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Download className="mr-2 h-5 w-5" />
                Download File
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">AES Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  Your files are protected with military-grade AES encryption before upload.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">Unique File IDs</h3>
                <p className="text-sm text-muted-foreground">
                  Each upload generates a unique ID for secure file retrieval and sharing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">Zero Knowledge</h3>
                <p className="text-sm text-muted-foreground">
                  We never see your encryption keys or file contents. Complete privacy guaranteed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 SecureShare. Your files, your keys, your privacy.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
