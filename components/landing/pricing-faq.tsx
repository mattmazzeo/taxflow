"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can I really use it for free forever?",
    answer: "Yes! Our free plan includes everything you need to get organized: upload up to 10 documents, AI extraction, a basic checklist, and export for your CPA. It's free forever, no credit card required. Most individuals find the free plan is enough. Upgrade only if you need automatic Gmail/Drive sync or want to track multiple tax years.",
  },
  {
    question: "How is this different from QuickBooks or TurboTax?",
    answer: "QuickBooks is for bookkeeping throughout the year, and TurboTax helps you file your return. TaxFlow sits between them—we help you gather and organize documents BEFORE you file. Think of us as your tax document command center. We make sure you have everything, then you take our organized package to TurboTax, your CPA, or any tax software.",
  },
  {
    question: "Will my CPA accept TaxFlow exports?",
    answer: "Absolutely! CPAs love TaxFlow. Our export creates a clean, organized PDF package with all documents sorted by category and year. Many CPAs tell us it saves them 1-2 hours of prep work per client. Some even recommend TaxFlow to their clients because it makes everyone's life easier.",
  },
  {
    question: "What if I have a complex tax situation?",
    answer: "TaxFlow works great for complex situations! Our Pro plan handles rental properties, multiple businesses, investments, and more. The smart checklist adapts to your situation. However, we organize and track documents—we don't provide tax advice. For complex strategy, you'll still want a good CPA (but they'll thank you for being so organized!).",
  },
  {
    question: "Is my data secure?",
    answer: "Extremely. We use bank-level 256-bit encryption, are SOC 2 compliant, and GDPR ready. Your documents are encrypted in transit and at rest. We never sell your data to anyone—ever. Our business model is simple: you pay us a fair price for software, not with your data. Many CPAs and financial advisors trust us with their clients' information.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, cancel anytime with one click—no phone calls, no retention teams. If you cancel a paid plan, you'll still have access through the end of your billing period, then you'll automatically revert to the free plan. Your documents stay accessible, you just lose premium features like automatic imports and multiple tax years.",
  },
];

export function PricingFAQ({ className = "" }: { className?: string }) {
  return (
    <div className={`max-w-3xl mx-auto ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Frequently asked questions</h3>
        <p className="text-muted-foreground">Everything you need to know before signing up</p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="border rounded-lg px-6 shadow-soft hover:shadow-premium transition-all"
          >
            <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="text-center text-sm text-muted-foreground mt-8">
        Still have questions? <a href="mailto:support@taxflow.com" className="text-primary hover:underline font-medium">Email us</a> and we'll respond within 24 hours.
      </p>
    </div>
  );
}

