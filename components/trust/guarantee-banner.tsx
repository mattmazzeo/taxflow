import { CheckCircle2 } from "lucide-react";

export function GuaranteeBanner({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-medium text-success ${className}`}>
      <CheckCircle2 className="h-4 w-4" />
      <span>14-day money-back guarantee • Cancel anytime</span>
    </div>
  );
}

