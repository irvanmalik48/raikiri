"use client";

import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  ScanBarcode,
  User,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import Separator from "./Separator";
import { useState } from "react";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const links = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
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
      label: "Titik Lokasi",
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
      {!sidebarOpen ? (
        <>
          <aside className="w-fit bottom-0 left-0 min-h-screen hidden sticky lg:top-0 lg:flex p-5">
            <div className="p-3">
              <div className="w-[24px] h-[24px]" />
            </div>
          </aside>
          <button
            className="p-3 z-[999] rounded-xl fixed bottom-5 right-5 lg:bottom-[unset] lg:right-[unset] lg:top-5 lg:left-5 bg-black -rotate-90 lg:-rotate-0 hover:bg-neutral-900 transition text-white"
            onClick={(e) => {
              e.preventDefault();
              setSidebarOpen(!sidebarOpen);
            }}
          >
            <PanelLeftOpen size={24} />
          </button>
        </>
      ) : (
        <aside className="w-full rounded-tr-2xl rounded-tl-2xl lg:rounded-tl-none lg:rounded-br-2xl fixed flex-col-reverse lg:flex-col lg:max-w-xs h-fit bottom-0 left-0 lg:min-h-screen lg:sticky lg:top-0 bg-neutral-100 flex p-5">
          <div className="flex flex-row-reverse lg:flex-row items-center gap-5 h-fit rounded-xl">
            <button
              className="p-3 rounded-xl bg-black hover:bg-neutral-900 transition -rotate-90 lg:-rotate-0 text-white"
              onClick={(e) => {
                e.preventDefault();
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <PanelLeftClose size={24} />
            </button>
            <h1 className="text-sm w-full font-semibold">
              Sistem Absensi Jama&apos;ah PETA Kabupaten Kediri
            </h1>
          </div>
          <Separator />
          <div className="grid grid-cols-2 lg:grid-cols-1 w-full gap-3">
            {links.map((link, i) => (
              <Link
                className="flex justify-start w-full items-center px-3 py-2 hover:text-white hover:bg-black transition text-sm gap-5 rounded-xl"
                href={link.href}
                key={i}
              >
                <link.icon size={24} />
                <p>{link.label}</p>
              </Link>
            ))}
            <button
              className="flex justify-start w-full items-center px-3 py-2 hover:text-white hover:bg-black transition text-sm gap-5 rounded-xl"
              onClick={async (e) => {
                e.preventDefault();

                const res = await fetch("/api/v1/admin/logout");

                const data = await res.json();

                if (!data.auth) {
                  window.location.href = "/login";
                }
              }}
            >
              <LogOut size={24} />
              <p>Logout</p>
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
