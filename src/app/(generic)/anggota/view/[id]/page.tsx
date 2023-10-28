import Separator from "@/components/Separator";
import UserProfile from "@/components/UserProfile";
import { User } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Anggota",
  description: "Keanggotaan page",
};

export default async function Home({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="items-center flex gap-3">
        <User size={24} />
        <h1 className="font-semibold text-2xl">Profil Anggota</h1>
      </div>
      <Separator />
      <UserProfile userId={params.id} />
    </>
  );
}
