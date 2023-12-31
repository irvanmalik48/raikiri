import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import MainLayout from "@/layouts/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainLayout>{children}</MainLayout>
        <footer className="w-full bg-black py-3 px-5">
          <p className="text-white text-center">
            2023 &copy; Jama&apos;ah PETA Kabupaten Kediri
          </p>
        </footer>
      </body>
    </html>
  );
}
