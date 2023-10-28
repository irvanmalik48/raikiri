import Separator from "@/components/Separator";
import { Metadata } from "next";
import { ScanBarcode } from "lucide-react";
import ScannerView from "@/components/ScannerView";

export const metadata: Metadata = {
  title: "Scanner",
  description: "Scanner page",
};

export default async function Home() {
  return (
    <>
      <div className="items-center flex gap-3">
        <ScanBarcode size={24} />
        <h1 className="font-semibold text-2xl">Scanner</h1>
      </div>
      <Separator />
      <ScannerView />
    </>
  );
}
