import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // We can fetch profile name here if needed, but since we removed Profile ID from UI,
  // we might want to just show "Member Profile" to be safe and avoid additional DB trips if we are doing SSG/ISR.
  // We'll keep it simple and static for now to avoid latency on the profile route.
  return {
    title: "Member Profile",
    description: "View member profile on Elite Tamil Matrimony. Connect with verified and premium members.",
  };
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
