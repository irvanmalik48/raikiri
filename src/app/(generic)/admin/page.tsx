import Separator from "@/components/Separator";
import { UserCircle } from "lucide-react";
import { Metadata } from "next";
import EditAdminForm from "@/components/EditAdminForm";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin page",
};

export default async function Home() {
  return (
    <>
      <div className="items-center flex gap-3">
        <UserCircle size={24} />
        <h1 className="font-semibold text-2xl">Admin</h1>
      </div>
      <Separator />
      <EditAdminForm />
    </>
  );
}
