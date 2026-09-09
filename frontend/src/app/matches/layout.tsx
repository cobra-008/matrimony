import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Matches",
  description: "View your AI-curated matches, new profiles, and premium members on Elite Tamil Matrimony.",
};

export default function MatchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
