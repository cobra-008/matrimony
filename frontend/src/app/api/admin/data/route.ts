import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";

// ── Auth guard ─────────────────────────────────────────────────────────────
async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const token  = req.cookies.get("admin_session")?.value;
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch { return false; }
}

// Service-role client (bypasses RLS for admin operations)
function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── GET /api/admin/data?type=... ──────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const supabase = adminSupabase();

  try {
    switch (type) {
      case "overview": {
        const [usersRes, plansRes, storiesRes, notifRes] = await Promise.all([
          supabase.from("profiles").select("id, created_at, is_verified, verification_status", { count: "exact" }),
          supabase.from("profiles").select("membership_plan, membership_expiry").not("membership_plan", "is", null),
          supabase.from("success_stories").select("id", { count: "exact" }),
          supabase.from("notifications").select("id", { count: "exact" }).eq("is_read", false),
        ]);
        const today = new Date(); today.setHours(0,0,0,0);
        const newToday = (usersRes.data || []).filter(u => new Date(u.created_at) >= today).length;
        return NextResponse.json({
          totalUsers: usersRes.count ?? 0,
          newToday,
          activePlans: (plansRes.data || []).filter(p => p.membership_expiry && new Date(p.membership_expiry) > new Date()).length,
          pendingVerification: (usersRes.data || []).filter(u => u.verification_status === "pending").length,
          successStories: storiesRes.count ?? 0,
          unreadNotifications: notifRes.count ?? 0,
        });
      }

      case "users": {
        const q = searchParams.get("q") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = 20;
        let query = supabase.from("profiles")
          .select("id, name, mobile, email, gender, is_verified, verification_status, is_banned, membership_plan, membership_expiry, created_at, city, state, photo_url", { count: "exact" })
          .order("created_at", { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);
        if (q) query = query.or(`name.ilike.%${q}%,mobile.ilike.%${q}%,email.ilike.%${q}%`);
        const { data, count } = await query;
        return NextResponse.json({ users: data, total: count });
      }

      case "user_detail": {
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
        const { data } = await supabase.from("profiles")
          .select("*, profile_photos(*)")
          .eq("id", id)
          .single();
        return NextResponse.json({ user: data });
      }

      case "verification": {
        const { data } = await supabase.from("profiles")
          .select("id, name, mobile, email, gender, verification_status, verification_document, created_at, photo_url, city")
          .eq("verification_status", "pending")
          .order("created_at", { ascending: true });
        return NextResponse.json({ requests: data });
      }

      case "subscriptions": {
        const { data } = await supabase.from("profiles")
          .select("id, name, mobile, membership_plan, membership_expiry, membership_activated, membership_price_paid, membership_plan_period, created_at")
          .not("membership_plan", "is", null)
          .order("membership_activated", { ascending: false });
        return NextResponse.json({ subscriptions: data });
      }

      case "success_stories": {
        const { data } = await supabase.from("success_stories")
          .select("*")
          .order("created_at", { ascending: false });
        return NextResponse.json({ stories: data });
      }

      case "notifications_log": {
        const { data } = await supabase.from("notifications")
          .select("*, profiles!user_id(name, mobile)")
          .eq("type", "admin_message")
          .order("created_at", { ascending: false })
          .limit(100);
        return NextResponse.json({ notifications: data });
      }

      default:
        return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

// ── POST /api/admin/data?action=... ──────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const body = await req.json();
  const supabase = adminSupabase();

  try {
    switch (action) {
      case "approve_verification": {
        const { userId } = body;
        await supabase.from("profiles").update({ verification_status: "approved", is_verified: true }).eq("id", userId);
        // Send notification
        await supabase.from("notifications").insert({
          user_id: userId, type: "verification_approved",
          title: "Profile Verified ✓",
          body: "Congratulations! Your profile has been verified by our team. A verified badge is now visible on your profile.",
          is_read: false,
        });
        return NextResponse.json({ ok: true });
      }

      case "reject_verification": {
        const { userId, reason } = body;
        await supabase.from("profiles").update({ verification_status: "rejected", is_verified: false }).eq("id", userId);
        await supabase.from("notifications").insert({
          user_id: userId, type: "verification_rejected",
          title: "Verification Request Declined",
          body: reason || "Your verification request was not approved. Please contact support for more information.",
          is_read: false,
        });
        return NextResponse.json({ ok: true });
      }

      case "ban_user": {
        const { userId, reason } = body;
        await supabase.from("profiles").update({ is_banned: true, ban_reason: reason || "Violated terms of service" }).eq("id", userId);
        await supabase.from("notifications").insert({
          user_id: userId, type: "admin_message",
          title: "Account Suspended",
          body: reason || "Your account has been suspended for violating our terms of service. Contact support to appeal.",
          is_read: false,
        });
        return NextResponse.json({ ok: true });
      }

      case "unban_user": {
        const { userId } = body;
        await supabase.from("profiles").update({ is_banned: false, ban_reason: null }).eq("id", userId);
        await supabase.from("notifications").insert({
          user_id: userId, type: "admin_message",
          title: "Account Restored",
          body: "Your account has been restored. You can now use Elite Tamil Matrimony again.",
          is_read: false,
        });
        return NextResponse.json({ ok: true });
      }

      case "send_notification": {
        const { userId, title, message } = body;
        // If no userId → broadcast to all
        if (userId === "all") {
          const { data: allUsers } = await supabase.from("profiles").select("id");
          const rows = (allUsers || []).map(u => ({
            user_id: u.id, type: "admin_message", title, body: message, is_read: false,
          }));
          if (rows.length) await supabase.from("notifications").insert(rows);
        } else {
          await supabase.from("notifications").insert({
            user_id: userId, type: "admin_message", title, body: message, is_read: false,
          });
        }
        return NextResponse.json({ ok: true });
      }

      case "upload_story_photo": {
        const { fileBase64, fileName, contentType } = body;
        if (!fileBase64 || !fileName) {
          return NextResponse.json({ error: "Missing file data" }, { status: 400 });
        }
        const buffer = Buffer.from(fileBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const cleanName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

        // Try 'success stories' bucket first, fallback to 'success-stories'
        let bucketName = "success stories";
        let uploadRes = await supabase.storage.from(bucketName).upload(cleanName, buffer, {
          contentType: contentType || "image/jpeg",
          upsert: true,
        });

        if (uploadRes.error) {
          bucketName = "success-stories";
          uploadRes = await supabase.storage.from(bucketName).upload(cleanName, buffer, {
            contentType: contentType || "image/jpeg",
            upsert: true,
          });
        }

        if (uploadRes.error) {
          return NextResponse.json({ error: uploadRes.error.message }, { status: 400 });
        }

        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(cleanName);
        return NextResponse.json({ ok: true, url: urlData.publicUrl });
      }

      case "add_success_story": {
        const { name, city, married, story, photo_url } = body;
        await supabase.from("success_stories").insert({ name, city, married, story, photo_url: photo_url || null });
        return NextResponse.json({ ok: true });
      }

      case "delete_success_story": {
        const { id } = body;
        await supabase.from("success_stories").delete().eq("id", id);
        return NextResponse.json({ ok: true });
      }

      case "update_admin_notes": {
        const { userId, notes } = body;
        await supabase.from("profiles").update({ admin_notes: notes }).eq("id", userId);
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
