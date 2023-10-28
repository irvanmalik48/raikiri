"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddAnggotaForm() {
  const [nama, setNama] = useState("");

  const router = useRouter();

  return (
    <form className="py-5 flex flex-col gap-5 max-w-lg">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Nama Lokasi</span>
        <input
          type="text"
          className="rounded-xl w-full px-3 py-2 border border-300"
          placeholder="Silahkan masukkan nama titik lokasi baru"
          onChange={(e) => setNama(e.target.value)}
        />
      </label>
      <button
        className="rounded-xl bg-black hover:bg-neutral-900 transition text-white py-2"
        onClick={async (e) => {
          e.preventDefault();

          if (!nama) {
            alert("Mohon isi semua field!");
            return;
          }

          const formData = new FormData();

          formData.append("name", nama);

          await fetch("/api/v1/lokasi/create", {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                alert(
                  "Gagal menambahkan asal titik baru! Pastikan nama asal titik tidak sama dengan nama asal titik lainnya!"
                );
                return;
              }

              alert("Berhasil menambahkan asal titik baru!");
            });

          router.push("/lokasi");
        }}
      >
        Tambah Lokasi
      </button>
    </form>
  );
}
