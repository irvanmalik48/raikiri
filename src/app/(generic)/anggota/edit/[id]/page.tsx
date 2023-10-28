import EditAnggotaForm from "@/components/EditAnggotaForm";
import Separator from "@/components/Separator";
import { User } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Anggota",
  description: "Keanggotaan page",
};

export default async function Home(props: { params: { id: string } }) {
  return (
    <>
      <div className="items-center flex gap-3">
        <User size={24} />
        <h1 className="font-semibold text-2xl">Edit Anggota</h1>
      </div>
      <Separator />
      <EditAnggotaForm cuid={props.params.id} />
    </>
  );
}
