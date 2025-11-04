"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Upload, Brain, Mail, FileCheck, Shield } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { HeroRelaxedIllustration } from "@/components/illustrations/hero-relaxed";
import { Testimonials } from "@/components/landing/testimonials";
import { StatsTicker } from "@/components/landing/stats-ticker";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SecurityBadges } from "@/components/trust/security-badge";
import { GuaranteeBanner } from "@/components/trust/guarantee-banner";

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
          <Logo />
          <Button variant="outline" onClick={() => router.push("#signup")}>
            Sign In
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Empathy First */}
        <section className="container flex flex-col items-center gap-12 py-16 text-center lg:py-24">
          <div className="space-y-6">
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Tax season doesn't have to feel like{" "}
              <span className="text-gradient-warm">tax season</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              We help you stay organized, feel confident, and stop worrying about missing forms.
            </p>
          </div>

          {/* Hero Illustration */}
          <div className="w-full max-w-2xl">
            <HeroRelaxedIllustration className="h-auto w-full" />
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-6">
            <Button size="lg" className="text-lg px-8 py-6 animate-lift" onClick={() => router.push("#signup")}>
              Start organizing for free
            </Button>
            <StatsTicker />
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="border-t bg-gradient-subtle py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Join thousands who stopped stressing about taxes
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Real people, real peace of mind
              </p>
            </div>
            <Testimonials />
            <div className="mt-12 flex justify-center">
              <SecurityBadges />
            </div>
          </div>
        </section>

        {/* How It Works - Story Flow */}
        <section className="container py-20">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Four simple steps to tax peace of mind
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              From chaos to organized in minutes, not hours
            </p>
          </div>
          <HowItWorks />
        </section>

        {/* Features Section - Benefit-First */}
        <section className="border-t bg-muted/40 py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to feel confident
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Built for real people, not accountants
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="animate-lift">
                <CardHeader>
                  <Upload className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Your documents, instantly understood</CardTitle>
                  <CardDescription>
                    Just drag and drop. Our AI knows a W-2 from a 1099, automatically extracting what matters.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="animate-lift">
                <CardHeader>
                  <Brain className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Never wonder what's missing</CardTitle>
                  <CardDescription>
                    Smart checklists based on your last year's documents. See exactly what you have and what you still need.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="animate-lift">
                <CardHeader>
                  <Mail className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Gentle reminders that actually work</CardTitle>
                  <CardDescription>
                    Weekly nudges during tax season with helpful context. We remind you, we don't stress you out.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="animate-lift">
                <CardHeader>
                  <FileCheck className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Hand it off like a pro</CardTitle>
                  <CardDescription>
                    Export everything your CPA needs in one organized package. They'll love you for it.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="animate-lift">
                <CardHeader>
                  <Shield className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Bank-level security for your peace of mind</CardTitle>
                  <CardDescription>
                    Your sensitive tax data stays private with enterprise-grade encryption. We never sell your data.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="animate-lift">
                <CardHeader>
                  <CheckCircle2 className="mb-2 h-8 w-8 text-success" />
                  <CardTitle>Set it and relax</CardTitle>
                  <CardDescription>
                    Connect Gmail or Drive once, and we'll automatically find tax documents as they arrive. Zero effort.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section - Value Positioning */}
        <section id="pricing" className="container py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Choose your level of confidence
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Start free, upgrade when you're ready for more peace of mind
            </p>
            <div className="mt-6 flex justify-center">
              <GuaranteeBanner />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Plan */}
            <Card className="relative animate-lift">
              <CardHeader>
                <CardTitle className="text-2xl">Start with peace of mind</CardTitle>
                <CardDescription className="text-base">Just getting organized</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground italic">Free forever. No credit card needed.</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>1 household, 1 active tax year</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Up to 10 documents with AI extraction</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Basic checklist and manual upload</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Export package for your CPA</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" onClick={() => router.push("#signup")}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Basic Plan */}
            <Card className="relative border-2 border-primary shadow-lg animate-lift scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-warning text-warning-foreground px-4 py-1 text-sm font-semibold">
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Stay confident all year</CardTitle>
                <CardDescription className="text-base">Families who want to stop worrying</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-success font-medium">Most popular for peace of mind</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>2 active tax years</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Up to 100 documents per year</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Automatic imports</strong> from Gmail & Drive</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Weekly email reminders</strong> during tax season</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Smart checklist that learns your situation</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={() => router.push("#signup")}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative animate-lift">
              <CardHeader>
                <CardTitle className="text-2xl">Work with your CPA like a pro</CardTitle>
                <CardDescription className="text-base">Complex taxes or small business</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground italic">For maximum confidence</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Unlimited tax years</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Up to 1,000 documents per year</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Priority AI parsing</strong> (faster processing)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>CPA-ready export packages</strong> with summaries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Priority email support</strong></span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" onClick={() => router.push("#signup")}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="mt-12 text-center text-sm text-muted-foreground">
            All plans include bank-level encryption, secure storage, and we never sell your data.
          </p>
        </section>

        {/* Sign Up Section - Trust First */}
        <section id="signup" className="border-t bg-gradient-subtle py-20">
          <div className="container max-w-xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Join 2,500+ people who stopped stressing about taxes</h2>
            <p className="mb-4 text-muted-foreground">
              Sign in with email or Google to start managing your tax documents.
            </p>
            <div className="mb-8 flex flex-col items-center gap-2">
              <SecurityBadges className="scale-90" />
              <p className="text-xs text-muted-foreground">
                We never sell your data. Bank-level encryption keeps your information secure.
              </p>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full h-12 text-base" onClick={handleGoogleSignIn}>
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-subtle px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                />
                <Button onClick={handleSignIn} disabled={loading || !email} className="h-12 px-6">
                  {loading ? "Sending..." : "Send Link"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                ✨ No password to remember - we'll email you a magic link
              </p>
            </div>

            <p className="mt-8 text-xs text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </section>
      </main>

      {/* Footer - Enhanced */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <Logo />
              <p className="text-sm text-muted-foreground">
                Tax season doesn't have to feel like tax season.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Trust & Security</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">For CPAs</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 TaxFlow. Built with care for people who dread tax season.
            </p>
            <SecurityBadges className="scale-75" />
          </div>
        </div>
      </footer>
    </div>
  );
}
