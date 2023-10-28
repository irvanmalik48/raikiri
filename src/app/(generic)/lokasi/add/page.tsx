import AddLokasiForm from "@/components/AddLokasiForm";
import Separator from "@/components/Separator";
import { Map } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Lokasi",
  description: "Lokasi page",
};

export default async function Home() {
  return (
    <>
      <div className="items-center flex gap-3">
        <Map size={24} />
        <h1 className="font-semibold text-2xl">Tambah Lokasi</h1>
      </div>
      <Separator />
      <AddLokasiForm />
    </>
  );
}
