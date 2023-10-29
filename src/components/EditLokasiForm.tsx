"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddAnggotaForm({ cuid }: { cuid: string }) {
  const [nama, setNama] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/v1/lokasi?cuid=${cuid}`)
      .then((res) => res.json())
      .then((data) => {
        setNama(data.name);
      });
  }, [cuid]);

  return (
    <form className="py-5 flex flex-col gap-5 max-w-lg">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Nama Titik Lokasi</span>
        <input
          type="text"
          className="rounded-xl w-full px-3 py-2 border border-300"
          placeholder="Silahkan masukkan nama titik lokasi yang ingin diubah"
          onChange={(e) => setNama(e.target.value)}
          defaultValue={nama}
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

          formData.append("id", cuid as string);
          formData.append("name", nama);

          await fetch("/api/v1/lokasi/edit", {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                alert(
                  "Gagal mengedit data! Pastikan nama titik lokasi tidak sama dengan nama lokasi lainnya!"
                );
                return;
              }

              alert("Berhasil mengedit data!");
            });

          router.push("/lokasi");
        }}
      >
        Simpan Perubahan
      </button>
    </form>
  );
}
