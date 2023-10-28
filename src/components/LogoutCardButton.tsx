"use client";

import { LogOut } from "lucide-react";

export default function LogoutCardButton() {
  return (
    <button
      className="w-full p-5 hover:bg-black transition flex flex-col gap-3 group bg-neutral-100/80 rounded-xl"
      onClick={async (e) => {
        e.preventDefault();

        const res = await fetch("/api/v1/admin/logout");

        const data = await res.json();

        if (!data.auth) {
          window.location.href = "/login";
        }
      }}
    >
      <div className="p-3 bg-neutral-200 w-fit rounded-full transition group-hover:text-white group-hover:bg-neutral-900">
        <LogOut size={24} />
      </div>
      <span className="font-semibold text-lg group-hover:text-white transition">
        Logout
      </span>
    </button>
  );
}
