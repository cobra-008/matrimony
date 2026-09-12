import { redirect } from "next/navigation";

export default function DailyRecsPage() {
  redirect("/matches?section=daily_matches");
}
