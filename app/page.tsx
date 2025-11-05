"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Upload, Brain, Mail, FileCheck, Shield, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { HeroRelaxedIllustration } from "@/components/illustrations/hero-relaxed";
import { Testimonials } from "@/components/landing/testimonials";
import { StatsTicker } from "@/components/landing/stats-ticker";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SecurityBadges } from "@/components/trust/security-badge";
import { GuaranteeBanner } from "@/components/trust/guarantee-banner";
import { VideoDemoModal, VideoPlayButton } from "@/components/landing/video-demo-modal";
import { CaseStudies } from "@/components/landing/case-studies";
import { WhyTaxFlow } from "@/components/landing/why-taxflow";
import { PricingFAQ } from "@/components/landing/pricing-faq";
import { FounderStory } from "@/components/landing/founder-story";
import { EarlyAccess } from "@/components/landing/early-access";
import { ExitIntentModal, useExitIntent } from "@/components/landing/exit-intent";
import { toast } from "sonner";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollCTA, setShowScrollCTA] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Exit intent detection
  useExitIntent(() => {
    // Only show once per session
    if (!sessionStorage.getItem("exitIntentShown")) {
      setShowExitIntent(true);
      sessionStorage.setItem("exitIntentShown", "true");
    }
  });

  // Handle scroll for sticky CTA
  useState(() => {
    const handleScroll = () => {
      setShowScrollCTA(window.scrollY > 600);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  });

  const handleSignIn = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      console.error("Error sending magic link:", error);
      toast.error("Error sending magic link. Please try again.");
    } else {
      toast.success("Check your email! 📧", {
        description: "We sent you a magic link to sign in.",
      });
      setEmail("");
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
      toast.error("Error signing in with Google. Please try again.");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Modals */}
      <VideoDemoModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} />
      <ExitIntentModal isOpen={showExitIntent} onClose={() => setShowExitIntent(false)} />

      {/* Header with Full Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("features")} className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection("how-it-works")} className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollToSection("pricing")} className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </button>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">For CPAs</a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleGoogleSignIn} className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button onClick={() => scrollToSection("signup")} className="hidden sm:inline-flex animate-press">
              Get Started Free
            </Button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background/98 backdrop-blur">
            <div className="container py-4 space-y-3">
              <button onClick={() => scrollToSection("features")} className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection("how-it-works")} className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection("pricing")} className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
                Pricing
              </button>
              <a href="#" className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">For CPAs</a>
              <div className="pt-2 space-y-2">
                <Button variant="outline" onClick={handleGoogleSignIn} className="w-full">Sign In</Button>
                <Button onClick={() => scrollToSection("signup")} className="w-full">Get Started Free</Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Scroll CTA */}
      {showScrollCTA && (
        <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-4 duration-300">
          <Button size="lg" onClick={() => scrollToSection("signup")} className="shadow-premium-hover animate-press">
            Get Started Free
          </Button>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section - Split Layout */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-radial opacity-50" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-sage/20 rounded-full blur-3xl" />
          
          <div className="container relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Content */}
              <div className="space-y-8 text-center lg:text-left">
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                    Get organized in 10 minutes.{" "}
                    <span className="block text-primary mt-2">Never miss a tax form again.</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                    Save 8+ hours this tax season with AI-powered organization. Trusted by 2,500+ families and their CPAs.
                  </p>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="font-medium">Free forever plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="font-medium">10-min setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="font-medium">No credit card</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Button 
                    size="lg" 
                    onClick={handleGoogleSignIn}
                    className="text-lg px-8 py-6 shadow-premium hover:shadow-premium-hover animate-press w-full sm:w-auto"
                  >
                    Start organizing free
                  </Button>
                  <VideoPlayButton onClick={() => setShowVideoModal(true)} />
                </div>

                {/* Security badges */}
                <div className="pt-4">
                  <SecurityBadges className="justify-center lg:justify-start" />
                </div>
              </div>

              {/* Right: Illustration */}
              <div className="relative">
                <div className="relative shadow-premium rounded-2xl overflow-hidden bg-gradient-subtle p-8">
                  <HeroRelaxedIllustration className="h-auto w-full" />
                </div>
                {/* Floating metric */}
                <div className="absolute -bottom-6 -left-6 lg:left-6 glass rounded-xl p-4 shadow-premium animate-float hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">2,500+</p>
                      <p className="text-xs text-muted-foreground">filed stress-free</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        <section id="how-it-works" className="container py-20">
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

        {/* Case Studies */}
        <section className="border-t bg-muted/20 py-20">
          <div className="container">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Real people, real results
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                See how TaxFlow transformed tax season for these families and professionals
              </p>
            </div>
            <CaseStudies />
          </div>
        </section>

        {/* Why TaxFlow - Differentiation */}
        <section className="container py-20">
          <WhyTaxFlow />
        </section>

        {/* Founder Story */}
        <section className="border-t bg-gradient-subtle py-20">
          <div className="container max-w-5xl">
            <FounderStory />
          </div>
        </section>

        {/* Features Section - Benefit-First */}
        <section id="features" className="border-t bg-muted/40 py-20">
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
              <Card className="shadow-soft hover:shadow-premium transition-all animate-lift">
                <CardHeader>
                  <Upload className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Your documents, instantly understood</CardTitle>
                  <CardDescription>
                    Just drag and drop. Our AI knows a W-2 from a 1099, automatically extracting what matters.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="shadow-soft hover:shadow-premium transition-all animate-lift">
                <CardHeader>
                  <Brain className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Never wonder what's missing</CardTitle>
                  <CardDescription>
                    Smart checklists based on your last year's documents. See exactly what you have and what you still need.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="shadow-soft hover:shadow-premium transition-all animate-lift">
                <CardHeader>
                  <Mail className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Gentle reminders that actually work</CardTitle>
                  <CardDescription>
                    Weekly nudges during tax season with helpful context. We remind you, we don't stress you out.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="shadow-soft hover:shadow-premium transition-all animate-lift">
                <CardHeader>
                  <FileCheck className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Hand it off like a pro</CardTitle>
                  <CardDescription>
                    Export everything your CPA needs in one organized package. They'll love you for it.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Early Access / Email Capture */}
        <section className="container py-20">
          <EarlyAccess />
        </section>

        {/* Pricing Section - Value Positioning */}
        <section id="pricing" className="border-t bg-gradient-subtle py-20">
          <div className="container">
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
            <Card className="relative shadow-soft hover:shadow-premium transition-all animate-lift">
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
                <Button className="w-full animate-press" variant="outline" onClick={handleGoogleSignIn}>
                  Get started free
                </Button>
              </CardContent>
            </Card>

            {/* Basic Plan - Most Popular */}
            <Card className="relative border-2 border-primary shadow-premium-hover animate-lift scale-105 bg-primary/5">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="px-6 py-2 rounded-full text-sm font-bold shadow-premium-hover" style={{ backgroundColor: 'hsl(38, 92%, 50%)', color: 'hsl(0, 0%, 10%)' }}>
                  ⭐ Most Popular
                </div>
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
                <Button size="lg" className="w-full animate-press shadow-premium-hover text-base font-semibold h-14" onClick={handleGoogleSignIn}>
                  Get started free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative shadow-soft hover:shadow-premium transition-all animate-lift">
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
                <Button className="w-full animate-press" variant="outline" onClick={handleGoogleSignIn}>
                  Get started free
                </Button>
              </CardContent>
            </Card>
          </div>

            <p className="mt-12 text-center text-sm text-muted-foreground">
              All plans include bank-level encryption, secure storage, and we never sell your data.
            </p>

            {/* Pricing FAQ */}
            <div className="mt-20">
              <PricingFAQ />
            </div>
          </div>
        </section>

        {/* Sign Up Section - Trust First */}
        <section id="signup" className="border-t py-20">
          <div className="container max-w-xl mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold">Join 2,500+ people who stopped stressing about taxes</h2>
            <p className="mb-4 text-muted-foreground">
              Sign in with email or Google to start managing your tax documents.
            </p>
            <div className="mb-8 flex flex-col items-center justify-center gap-2">
              <SecurityBadges className="scale-90" />
              <p className="text-xs text-muted-foreground max-w-md">
                We never sell your data. Bank-level encryption keeps your information secure.
              </p>
            </div>

            <div className="space-y-4 mx-auto max-w-md">
              <Button 
                variant="outline" 
                className="w-full h-12 text-base animate-press shadow-soft hover:shadow-premium transition-all" 
                onClick={handleGoogleSignIn}
                aria-label="Sign in with Google"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
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
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <label htmlFor="signup-email" className="sr-only">Email address</label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 shadow-inset flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                  aria-label="Email address for magic link"
                />
                <Button 
                  onClick={handleSignIn} 
                  disabled={loading || !email} 
                  className="h-12 px-6 animate-press"
                  aria-label={loading ? "Sending magic link" : "Send magic link to email"}
                >
                  {loading ? "Sending..." : "Send Link"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                ✨ No password to remember - we'll email you a magic link
              </p>
            </div>

            <p className="mt-8 text-xs text-muted-foreground text-center max-w-md mx-auto">
              By signing up, you agree to our <a href="/terms" className="underline hover:text-foreground">Terms of Service</a> and <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
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
              {/* Newsletter signup */}
              <div className="pt-2">
                <p className="text-xs font-semibold mb-2">Stay updated</p>
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="h-9 text-sm"
                    aria-label="Newsletter email"
                  />
                  <Button size="sm" variant="outline" className="whitespace-nowrap">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection("pricing")} className="hover:text-primary transition-colors">Pricing</button></li>
                <li><button onClick={() => scrollToSection("features")} className="hover:text-primary transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection("how-it-works")} className="hover:text-primary transition-colors">How It Works</button></li>
                <li><button onClick={() => scrollToSection("pricing")} className="hover:text-primary transition-colors">FAQ</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Trust & Security</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/security" className="hover:text-primary transition-colors">Security</a></li>
                <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:support@taxflow.com" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="/for-cpas" className="hover:text-primary transition-colors">For CPAs</a></li>
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
