import { Shield, Lock, CheckCircle2 } from "lucide-react";

export function SecurityBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-5 w-5 text-primary" />
        <span>Bank-Level Encryption</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-5 w-5 text-primary" />
        <span>SOC 2 Compliant</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <span>GDPR Ready</span>
      </div>
    </div>
  );
}

