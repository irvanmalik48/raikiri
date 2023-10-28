import LogoutCardButton from "@/components/LogoutCardButton";
import Separator from "@/components/Separator";
import {
  CalendarDays,
  LayoutDashboard,
  ScanBarcode,
  User,
  UserCircle,
  Map,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard page",
};

export default function Home() {
  const links = [
    {
      href: "/anggota",
      label: "Anggota",
      icon: User,
    },
    {
      href: "/kegiatan",
      label: "Kegiatan",
      icon: CalendarDays,
    },
    {
      href: "/lokasi",
      label: "Lokasi",
      icon: Map,
    },
    {
      href: "/scanner",
      label: "Scanner",
      icon: ScanBarcode,
    },
    {
      href: "/admin",
      label: "Admin",
      icon: UserCircle,
    },
  ];

  return (
    <>
      <div className="items-center flex gap-3">
        <LayoutDashboard size={24} />
        <h1 className="font-semibold text-2xl">Dashboard</h1>
      </div>
      <Separator />
      <p>
        Selamat datang di Sistem Absensi Jama&apos;ah Pondok. Silahkan pilih
        menu dibawah ini.
      </p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-3xl gap-5 py-5">
        {links.map((link, i) => (
          <Link
            className="w-full p-5 hover:bg-black transition flex flex-col gap-3 group bg-neutral-100/80 rounded-xl"
            href={link.href}
            key={i}
          >
            <div className="p-3 bg-neutral-200 w-fit rounded-full transition group-hover:text-white group-hover:bg-neutral-900">
              <link.icon size={24} />
            </div>
            <span className="font-semibold text-lg group-hover:text-white transition">
              {link.label}
            </span>
          </Link>
        ))}
        <LogoutCardButton />
      </div>
    </>
  );
}
