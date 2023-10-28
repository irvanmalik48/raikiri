import UsersDataTable from "@/components/UsersDataTable";
import Separator from "@/components/Separator";
import { User } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keanggotaan",
  description: "Keanggotaan page",
};

export default async function Home() {
  return (
    <>
      <div className="items-center flex gap-3">
        <User size={24} />
        <h1 className="font-semibold text-2xl">Keanggotaan</h1>
      </div>
      <Separator />
      <UsersDataTable />
    </>
  );
}
