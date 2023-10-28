"use client";

import { Lokasi, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddAnggotaForm({ cuid }: { cuid: string }) {
  const [data, setData] = useState<
    | (User & {
        lokasi: Lokasi;
      })
    | null
  >(null);

  const [nama, setNama] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [lokasiId, setLokasiId] = useState("");
  const [statusKeanggotaan, setStatusKeanggotaan] = useState("");
  const [lokasiArr, setLokasiArr] = useState<Lokasi[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/v1/users?cuid=${cuid}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setNama(data.name);
        setLokasi(data.lokasi.name);
        setStatusKeanggotaan(data.statusKeanggotaan);
      });

    fetch(`/api/v1/lokasi`)
      .then((res) => res.json())
      .then((data) => {
        setLokasiArr(data);
      });
  }, [cuid]);

  return (
    <form className="py-5 flex flex-col gap-5 max-w-lg">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Nama Lengkap</span>
        <input
          type="text"
          className="rounded-xl w-full px-3 py-2 border border-300"
          placeholder="Silahkan masukkan nama lengkap anggota yang ingin diubah"
          onChange={(e) => setNama(e.target.value)}
          defaultValue={nama}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Asal Titik</span>
        <input
          type="text"
          className="rounded-xl w-full px-3 py-2 border border-300"
          placeholder="Silahkan masukkan asal titik anggota yang ingin diubah"
          onChange={(e) => {
            setLokasi(e.target.value);
            const lokasiId = lokasiArr.find(
              (lokasi) => lokasi.name === e.target.value
            )?.id;

            setLokasiId((lokasiId as string) ?? "");
          }}
          defaultValue={lokasi}
          list="lokasiList"
        />
        <datalist id="lokasiList">
          {lokasiArr.map((lokasi, i) => (
            <option key={i} value={lokasi.name as string} />
          ))}
        </datalist>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Status Keanggotaan</span>
        <input
          type="text"
          className="rounded-xl w-full px-3 py-2 border border-300"
          placeholder="Silahkan masukkan status keanggotaan jama'ah yang ingin diubah"
          onChange={(e) => setStatusKeanggotaan(e.target.value)}
          defaultValue={statusKeanggotaan}
        />
      </label>
      <button
        className="rounded-xl bg-black hover:bg-neutral-900 transition text-white py-2"
        onClick={async (e) => {
          e.preventDefault();

          if (!nama || !lokasi || !statusKeanggotaan) {
            alert("Mohon isi semua field!");
            return;
          }

          const formData = new FormData();

          formData.append("id", data?.id as string);
          formData.append("name", nama);
          formData.append("lokasi", lokasi);
          formData.append("lokasiId", lokasiId);
          formData.append("statusName", statusKeanggotaan);

          await fetch("/api/v1/users/edit", {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                alert("Gagal mengedit data! Terjadi kesalahan pada server!");
                return;
              }

              alert("Berhasil mengedit data!");
            });

          router.push("/anggota");
        }}
      >
        Simpan Perubahan
      </button>
    </form>
  );
}
