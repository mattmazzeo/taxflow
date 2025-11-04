import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendNudgeEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if we're in tax season (January through April)
    const currentMonth = new Date().getMonth() + 1; // 1-12
    if (currentMonth < 1 || currentMonth > 4) {
      console.log("Not tax season, skipping nudges");
      return NextResponse.json({
        success: true,
        message: "Not tax season, nudges skipped",
        sent: 0,
      });
    }

    // Use service client to bypass RLS
    const supabase = await createServiceClient();

    // Get current year
    const currentYear = new Date().getFullYear();

    // Find all tax years that are "collecting" for current year
    const { data: taxYears, error: taxYearsError } = await supabase
      .from("tax_years")
      .select("*, household:households(*)")
      .eq("year", currentYear)
      .eq("status", "collecting");

    if (taxYearsError) {
      console.error("Error fetching tax years:", taxYearsError);
      return NextResponse.json(
        { error: "Failed to fetch tax years" },
        { status: 500 }
      );
    }

    if (!taxYears || taxYears.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No tax years in collecting status",
        sent: 0,
      });
    }

    let emailsSent = 0;
    const errors: string[] = [];

    // Process each tax year
    for (const taxYear of taxYears) {
      // Get missing required checklist items
      const { data: missingItems } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("tax_year_id", taxYear.id)
        .eq("required", true)
        .neq("status", "done");

      if (!missingItems || missingItems.length === 0) {
        console.log(`No missing items for tax year ${taxYear.id}, skipping`);
        continue;
      }

      // Get household owner
      const { data: membership } = await supabase
        .from("memberships")
        .select("user_id, profiles(*)")
        .eq("household_id", taxYear.household_id)
        .eq("role", "owner")
        .single();

      if (!membership || !membership.profiles) {
        console.error(`No owner found for household ${taxYear.household_id}`);
        continue;
      }

      const profile = Array.isArray(membership.profiles)
        ? membership.profiles[0]
        : membership.profiles;

      // Check if user has Basic or Pro plan (nudges not available on Free)
      if (profile.plan === "free") {
        console.log(`User ${profile.user_id} is on free plan, skipping nudge`);
        continue;
      }

      // Check if we already sent a nudge this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: recentNudges } = await supabase
        .from("nudges")
        .select("sent_at")
        .eq("tax_year_id", taxYear.id)
        .eq("user_id", profile.user_id)
        .gte("sent_at", oneWeekAgo.toISOString())
        .limit(1);

      if (recentNudges && recentNudges.length > 0) {
        console.log(
          `Already sent nudge this week for user ${profile.user_id}, skipping`
        );
        continue;
      }

      // Send nudge email
      const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/checklist`;

      const result = await sendNudgeEmail({
        to: profile.email,
        name: profile.full_name || "there",
        missingItems: missingItems.map((item) => ({
          title: item.title,
          category: item.category || "",
        })),
        taxYear: taxYear.year,
        dashboardUrl,
      });

      if (result.success) {
        // Log nudge in database
        await supabase.from("nudges").insert({
          tax_year_id: taxYear.id,
          user_id: profile.user_id,
          channel: "email",
          template: "weekly_missing_docs",
          subject: `TaxFlow Reminder: ${missingItems.length} documents missing for ${taxYear.year}`,
        });

        emailsSent++;
        console.log(`Nudge email sent to ${profile.email}`);
      } else {
        errors.push(`Failed to send to ${profile.email}: ${result.error}`);
        console.error(`Failed to send nudge to ${profile.email}:`, result.error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${emailsSent} nudge email(s)`,
      sent: emailsSent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Weekly nudges cron error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

