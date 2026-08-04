import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import MigrationRunner from "@/components/ui/MigrationRunner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Elite Tamil Matrimony — The No.1 Tamil Matrimony Site",
    template: "%s | Elite Tamil Matrimony",
  },
  description:
    "Elite Tamil Matrimony — The most trusted Tamil matrimony platform. 25 Lakh+ verified profiles. Find your perfect Tamil match today.",
  keywords: [
    "Tamil matrimony",
    "Tamil marriage",
    "Tamil brides",
    "Tamil grooms",
    "Tamil wedding",
    "Chennai matrimony",
    "Coimbatore matrimony",
    "Tamil Nadu matrimony",
    "NRI Tamil matrimony",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://elitetamilmatrimony.com",
    siteName: "Elite Tamil Matrimony",
    title: "Elite Tamil Matrimony — The No.1 Tamil Matrimony Site",
    description: "25 Lakh+ verified Tamil profiles. Find your perfect match.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body
        className="min-h-screen flex flex-col"
        style={{ fontFamily: "var(--font-poppins, 'Poppins', sans-serif)" }}
      >
        <AuthProvider>
          <MigrationRunner />
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
                borderRadius: "4px",
                border: "1px solid #DDDDDD",
                fontSize: "14px",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
