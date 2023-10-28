import AddGiatForm from "@/components/AddGiatForm";
import Separator from "@/components/Separator";
import { CalendarDays } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Kegiatan",
  description: "Kegiatan page",
};

export default async function Home() {
  return (
    <>
      <div className="items-center flex gap-3">
        <CalendarDays size={24} />
        <h1 className="font-semibold text-2xl">Buat Kegiatan</h1>
      </div>
      <Separator />
      <AddGiatForm />
    </>
  );
}
