import EditLokasiForm from "@/components/EditLokasiForm";
import Separator from "@/components/Separator";
import { Map } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Lokasi",
  description: "Lokasi page",
};

export default async function Home(props: { params: { id: string } }) {
  return (
    <>
      <div className="items-center flex gap-3">
        <Map size={24} />
        <h1 className="font-semibold text-2xl">Edit Lokasi</h1>
      </div>
      <Separator />
      <EditLokasiForm cuid={props.params.id} />
    </>
  );
}
