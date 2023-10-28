import Separator from "@/components/Separator";
import { Metadata } from "next";
import { Map } from "lucide-react";
import LokasiDataTable from "@/components/LokasiDataTable";

export const metadata: Metadata = {
  title: "Lokasi",
  description: "Lokasi page",
};

export default async function Home() {
  return (
    <>
      <div className="items-center flex gap-3">
        <Map size={24} />
        <h1 className="font-semibold text-2xl">Lokasi</h1>
      </div>
      <Separator />
      <LokasiDataTable />
    </>
  );
}
