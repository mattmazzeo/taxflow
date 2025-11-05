"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/brand/logo";
import { SecurityBadges } from "@/components/trust/security-badge";
import { CheckCircle2, Clock, FileCheck, Mail, Shield, TrendingUp, Users, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function ForCPAsPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    // TODO: Add to CPA mailing list
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Thanks! We'll be in touch soon 📧");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div className="absolute inset-0 bg-gradient-radial opacity-50" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-sage/20 rounded-full blur-3xl" />
          
          <div className="container relative max-w-5xl mx-auto">
            <div className="text-center space-y-6">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                For Tax Professionals
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Your clients, finally organized.{" "}
                <span className="block text-primary mt-2">Your life, way easier.</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                TaxFlow makes your clients' lives easier—and yours too. No more chasing down documents or sorting through messy folders. Get organized exports, automatic categorization, and clients who actually have their documents ready on time.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-medium">Free for your clients to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-medium">CPA-ready exports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-medium">No training required</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="border-t bg-muted/20 py-20">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                We know what you deal with every tax season
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sound familiar?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-xl">😤 "Where's your W-2?"</CardTitle>
                  <CardDescription className="text-base">
                    The endless back-and-forth trying to get clients to send you their documents. Sometimes taking weeks.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-xl">📧 Email chaos</CardTitle>
                  <CardDescription className="text-base">
                    Documents scattered across 10 different email threads, text messages, and that one Dropbox link from last year.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-xl">🔍 Missing forms</CardTitle>
                  <CardDescription className="text-base">
                    Client swears they sent everything, but you're missing their 1099-INT. Again.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-xl">⏰ Last-minute rush</CardTitle>
                  <CardDescription className="text-base">
                    Everyone shows up in the last two weeks before the deadline with a shoebox of receipts.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Solution - How TaxFlow Helps */}
        <section className="container py-20 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              How TaxFlow makes your job easier
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your clients use TaxFlow to get organized. You get organized clients.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-soft hover:shadow-premium transition-all">
              <CardHeader>
                <FileCheck className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Organized exports</CardTitle>
                <CardDescription>
                  All documents in one clean package, properly categorized and labeled. No more hunting through email threads.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-premium transition-all">
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Auto-categorization</CardTitle>
                <CardDescription>
                  AI automatically identifies W-2s, 1099s, and other forms. Your clients don't need to know the difference.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-premium transition-all">
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Gentle reminders</CardTitle>
                <CardDescription>
                  Clients get weekly nudges during tax season. Less time spent chasing them down for missing documents.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-premium transition-all">
              <CardHeader>
                <Mail className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Gmail & Drive integration</CardTitle>
                <CardDescription>
                  Documents automatically imported from email and cloud storage. Everything in one place for you.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-premium transition-all">
              <CardHeader>
                <CheckCircle2 className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Smart checklists</CardTitle>
                <CardDescription>
                  Based on previous year's filings, so clients know exactly what to collect. Fewer missing documents.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-premium transition-all">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Bank-level security</CardTitle>
                <CardDescription>
                  SOC 2 compliant, encrypted storage. You can recommend it with confidence.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Stats / Social Proof */}
        <section className="border-t bg-gradient-subtle py-20">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Already helping CPAs and their clients
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">2,500+</div>
                <p className="text-muted-foreground">Families organized and ready</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">8+ hours</div>
                <p className="text-muted-foreground">Saved per household</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">Free</div>
                <p className="text-muted-foreground">For your clients to start</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="container py-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              What clients say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">"</div>
                <p className="text-lg mb-6">
                  My CPA was shocked when I sent everything organized in one PDF. She said it was the best client package she'd received all year. TaxFlow made me look like a pro.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage to-cream flex items-center justify-center font-bold text-lg">
                    JR
                  </div>
                  <div>
                    <p className="font-semibold">Jessica R.</p>
                    <p className="text-sm text-muted-foreground">Freelance Designer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">"</div>
                <p className="text-lg mb-6">
                  I used to dread tax season. This year I had everything ready in February. My accountant actually thanked me. Game changer.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-terracotta to-cream flex items-center justify-center font-bold text-lg">
                    MK
                  </div>
                  <div>
                    <p className="font-semibold">Michael K.</p>
                    <p className="text-sm text-muted-foreground">Small Business Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Partner Program / CTA */}
        <section id="partner-cta" className="border-t bg-muted/20 py-20">
          <div className="container max-w-3xl mx-auto">
            <Card className="shadow-premium border-2 border-primary/20">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl mb-4">
                  Interested in partnering with TaxFlow?
                </CardTitle>
                <CardDescription className="text-base">
                  We're building a CPA partner program to help you recommend TaxFlow to your clients and streamline your practice. Join the waitlist to learn more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="your@cpafirm.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 flex-1"
                      required
                    />
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="h-12 px-8 animate-press"
                      size="lg"
                    >
                      {loading ? "Joining..." : "Join Waitlist"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    We'll reach out with more details about our partner program
                  </p>
                </form>

                <div className="mt-8 pt-8 border-t">
                  <h4 className="font-semibold mb-4 text-center">What we're planning:</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Custom referral codes for your practice</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Co-branded landing pages</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Direct client-to-CPA export features</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Priority support for partner firms</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Security Section */}
        <section className="container py-20 max-w-5xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Security and compliance you can trust</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We take data security seriously. Your clients' information is protected with enterprise-grade security.
            </p>
            <SecurityBadges className="justify-center mb-6" />
            <p className="text-sm text-muted-foreground">
              SOC 2 Type II • Bank-level encryption • HIPAA compliant • We never sell data
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t py-20 bg-gradient-subtle">
          <div className="container max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to make tax season easier?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Recommend TaxFlow to your clients or join our partner program waitlist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="animate-press">
                <Link href="/">See TaxFlow for Clients</Link>
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                const element = document.getElementById("partner-cta");
                element?.scrollIntoView({ behavior: "smooth" });
              }}>
                Join Partner Waitlist
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/">
              <Logo />
            </Link>
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

