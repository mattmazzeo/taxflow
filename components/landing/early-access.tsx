"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function EarlyAccess({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    
    // Simulate API call - in production, this would save to database and send email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Checklist sent! 📋", {
      description: "Check your email for your free tax document checklist.",
    });
    
    setEmail("");
    setLoading(false);
  };

  return (
    <Card className={`shadow-premium border-2 border-primary/20 ${className}`}>
      <CardContent className="p-8 lg:p-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <Download className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl lg:text-3xl font-bold">
              Not ready to sign up? Get our free checklist.
            </h3>
            <p className="text-muted-foreground">
              Download our comprehensive tax document checklist used by 2,500+ families. Know exactly what you need before tax season hits.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <div className="flex-1">
              <Label htmlFor="early-email" className="sr-only">Email address</Label>
              <Input
                id="early-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 shadow-inset"
                required
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              disabled={loading}
              className="h-12 px-8 animate-press whitespace-nowrap"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send me the checklist
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            ✓ Free download • ✓ No spam, ever • ✓ Unsubscribe anytime
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

