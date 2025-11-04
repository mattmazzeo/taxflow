"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileText, Brain, CheckSquare, Mail, Upload, Zap } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async () => {
    if (!email) return;
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      console.error("Error sending magic link:", error);
      alert("Error sending magic link. Please try again.");
    } else {
      alert("Check your email for the magic link!");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-bold">TaxFlow</span>
          </div>
          <Button variant="outline" onClick={() => router.push("#pricing")}>
            Sign In
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container flex flex-col items-center gap-8 py-20 text-center lg:py-32">
          <Badge variant="secondary" className="px-4 py-1">
            AI-Powered Tax Document Management
          </Badge>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Never miss a tax document again
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            TaxFlow uses AI to organize your W-2s, 1099s, and receipts. Get smart checklists,
            automated reminders, and export everything for your CPA.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" onClick={() => router.push("#pricing")}>
              Get Started Free
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/40 py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need for tax season
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                From document ingestion to CPA export, TaxFlow handles it all.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Upload className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Smart Upload</CardTitle>
                  <CardDescription>
                    Drag and drop PDFs or connect Gmail/Drive to automatically find tax documents.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Brain className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>AI Extraction</CardTitle>
                  <CardDescription>
                    Automatically detect document types and extract key fields like EIN, amounts, and
                    withholdings.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CheckSquare className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Smart Checklists</CardTitle>
                  <CardDescription>
                    Get personalized checklists based on last year's documents. Never forget a form.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Mail className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Email Nudges</CardTitle>
                  <CardDescription>
                    Weekly reminders during tax season with links to missing documents.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>One-Click Export</CardTitle>
                  <CardDescription>
                    Export everything as a ZIP with CSVs and original files for your accountant.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <FileText className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Secure Storage</CardTitle>
                  <CardDescription>
                    Bank-level encryption with Supabase. Your sensitive tax data stays private.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Start free, upgrade as you need more features.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />1 household
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />1 active tax year
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />Up to 10 documents
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />Manual upload only
                  </li>
                </ul>
                <Button className="mt-6 w-full" variant="outline" onClick={() => router.push("#signup")}>
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Basic Plan */}
            <Card className="border-primary">
              <CardHeader>
                <Badge className="w-fit">Most Popular</Badge>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For individuals and families</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />2 active tax years
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />Up to 100 documents
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />Gmail & Drive ingest
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />Weekly email nudges
                  </li>
                </ul>
                <Button className="mt-6 w-full" onClick={() => router.push("#signup")}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For power users and businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />Unlimited tax years
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />Up to 1000 documents
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />Priority AI parsing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />Export package for CPA
                  </li>
                </ul>
                <Button className="mt-6 w-full" variant="outline" onClick={() => router.push("#signup")}>
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sign Up Section */}
        <section id="signup" className="border-t bg-muted/40 py-20">
          <div className="container max-w-xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to get organized?</h2>
            <p className="mb-8 text-muted-foreground">
              Sign in with email or Google to start managing your tax documents.
            </p>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                />
                <Button onClick={handleSignIn} disabled={loading || !email}>
                  {loading ? "Sending..." : "Send Magic Link"}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-muted/40 px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>

            <p className="mt-8 text-xs text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span className="font-semibold">TaxFlow</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © 2025 TaxFlow. Built with Next.js, Supabase, and OpenAI.
          </p>
        </div>
      </footer>
    </div>
  );
}
