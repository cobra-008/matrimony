import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Profiles",
  description: "Search for your perfect life partner on Elite Tamil Matrimony. Filter by caste, religion, education, profession, and more.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
