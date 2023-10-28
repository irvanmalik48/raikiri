import KegiatanInfo from "@/components/KegiatanInfo";
import Separator from "@/components/Separator";
import { CalendarDays } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kegiatan",
  description: "Kegiatan page",
};

export default async function Home({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="items-center flex gap-3">
        <CalendarDays size={24} />
        <h1 className="font-semibold text-2xl">Kegiatan</h1>
      </div>
      <Separator />
      <KegiatanInfo cuid={params.id} />
    </>
  );
}
