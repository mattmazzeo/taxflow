import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

/**
 * Get the current user from the session
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get user profile with plan information
 */
export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return profile;
}

/**
 * Get user's household
 */
export async function getUserHousehold(userId: string) {
  const supabase = await createClient();
  const { data: membership, error } = await supabase
    .from("memberships")
    .select("household:households(*)")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching household:", error);
    return null;
  }

  return membership?.household || null;
}

/**
 * Check user's plan limits
 */
export async function checkPlanLimits(userId: string) {
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  const limits = {
    free: { households: 1, taxYears: 1, documents: 10, features: ["upload"] },
    basic: { households: 1, taxYears: 2, documents: 100, features: ["upload", "gmail", "drive", "nudges"] },
    pro: { households: 999, taxYears: 999, documents: 1000, features: ["upload", "gmail", "drive", "nudges", "export"] },
  };

  return {
    plan: profile.plan,
    limits: limits[profile.plan],
  };
}

/**
 * Initialize user data on first sign-up
 * Creates profile, household, membership, and default tax years
 */
export async function initializeUserData(
  userId: string,
  email: string,
  fullName?: string
) {
  const supabase = await createClient();

  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (existingProfile) {
      console.log("Profile already exists for user:", userId);
      return { success: true };
    }

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: userId,
      email,
      full_name: fullName || null,
      plan: "free",
    });

    if (profileError) throw profileError;

    // Create household
    const householdId = uuidv4();
    const { error: householdError } = await supabase.from("households").insert({
      id: householdId,
      owner_id: userId,
      name: "My Household",
    });

    if (householdError) throw householdError;

    // Create membership
    const { error: membershipError } = await supabase.from("memberships").insert({
      household_id: householdId,
      user_id: userId,
      role: "owner",
    });

    if (membershipError) throw membershipError;

    // Create tax years for last year and this year
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const { error: taxYearsError } = await supabase.from("tax_years").insert([
      {
        household_id: householdId,
        year: lastYear,
        status: "reviewing",
      },
      {
        household_id: householdId,
        year: currentYear,
        status: "collecting",
      },
    ]);

    if (taxYearsError) throw taxYearsError;

    console.log("Successfully initialized user data for:", email);
    return { success: true };
  } catch (error) {
    console.error("Error initializing user data:", error);
    return { success: false, error };
  }
}

/**
 * Get user's plan from billing or profile
 */
export async function getUserPlan(userId: string): Promise<'free' | 'basic' | 'pro'> {
  const supabase = await createClient();
  
  // Check billing first
  const { data: billing } = await supabase
    .from("billing")
    .select("plan")
    .eq("user_id", userId)
    .single();

  if (billing) {
    return billing.plan;
  }

  // Fallback to profile
  const profile = await getUserProfile(userId);
  return profile?.plan || 'free';
}

