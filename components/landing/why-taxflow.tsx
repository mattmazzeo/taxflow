"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Minus } from "lucide-react";

const comparisonData = [
  {
    feature: "Time to organize",
    manual: "4-8 hours",
    taxflow: "10 minutes",
    fullService: "0 (but costs $500+)",
  },
  {
    feature: "Finding documents",
    manual: "Hunt through emails & folders",
    taxflow: "Automatic from Gmail/Drive",
    fullService: "You still have to find them",
  },
  {
    feature: "Knowing what's missing",
    manual: "Guesswork & stress",
    taxflow: "Smart checklist tells you",
    fullService: "CPA tells you after you pay",
  },
  {
    feature: "AI extraction",
    manual: "Manual typing",
    taxflow: "Automatic (W-2s, 1099s, etc)",
    fullService: "CPA does it (billable time)",
  },
  {
    feature: "Cost",
    manual: "Free (your time)",
    taxflow: "$0-19/month",
    fullService: "$300-2,000",
  },
  {
    feature: "Control & transparency",
    manual: "Full control",
    taxflow: "Full control + guidance",
    fullService: "Limited visibility",
  },
  {
    feature: "Works with your CPA",
    manual: "Yes (but messy)",
    taxflow: "Yes (they'll love you)",
    fullService: "It IS the CPA",
  },
];

const objections = [
  {
    question: "Why not just use a folder on my computer?",
    answer: "A folder can't tell you what's missing, can't automatically find documents in your Gmail, and can't extract data from PDFs. You're still spending hours organizing and hoping you didn't forget something. TaxFlow does all that automatically.",
    icon: "📂",
  },
  {
    question: "Why not just give everything to my CPA?",
    answer: "Your CPA charges by the hour. If you hand them a mess, they'll spend 2+ hours organizing before they even start your taxes—that's $400-800 in billable time. TaxFlow gets you organized first, so your CPA can focus on actual tax strategy. You save money and they work more efficiently.",
    icon: "💰",
  },
  {
    question: "Can't I just do this myself for free?",
    answer: "Absolutely! But consider this: most people spend 6-10 hours per tax season hunting documents, checking if they're missing anything, and manually organizing. TaxFlow does it in 10 minutes. If your time is worth even $20/hour, you save $120-200. Plus, our AI catches forms you might miss. It pays for itself.",
    icon: "⏰",
  },
];

export function WhyTaxFlow({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-12 ${className}`}>
      {/* Objection Handling */}
      <div>
        <h3 className="text-2xl font-bold text-center mb-8">Common questions</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {objections.map((obj, index) => (
            <Card key={index} className="shadow-soft animate-lift">
              <CardHeader>
                <div className="text-4xl mb-3">{obj.icon}</div>
                <CardTitle className="text-lg">{obj.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{obj.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div>
        <h3 className="text-2xl font-bold text-center mb-8">How TaxFlow compares</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left p-4 font-semibold text-muted-foreground text-sm">Feature</th>
                <th className="p-4 text-center">
                  <div className="font-bold text-base">Manual<br/>(DIY)</div>
                </th>
                <th className="p-4 text-center bg-primary/5 border-x-2 border-primary/20">
                  <div className="font-bold text-base text-primary">TaxFlow</div>
                  <div className="text-xs text-primary/70">Best value</div>
                </th>
                <th className="p-4 text-center">
                  <div className="font-bold text-base">Full-Service<br/>CPA</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-sm">{row.feature}</td>
                  <td className="p-4 text-center text-sm text-muted-foreground">
                    {row.manual}
                  </td>
                  <td className="p-4 text-center text-sm font-medium bg-primary/5 border-x-2 border-primary/20">
                    <div className="flex items-center justify-center gap-2">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span>{row.taxflow}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm text-muted-foreground">
                    {row.fullService}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6 max-w-2xl mx-auto">
          TaxFlow gives you the control of DIY with the intelligence of professional software, at a fraction of the cost of full-service CPAs.
        </p>
      </div>
    </div>
  );
}

