"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lokasi } from "@prisma/client";

export default function AddAnggotaForm() {
  const [nama, setNama] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [statusKeanggotaan, setStatusKeanggotaan] = useState("");
  const [lokasiArr, setLokasiArr] = useState<Lokasi[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/v1/lokasi`)
      .then((res) => res.json())
      .then((data) => {
        setLokasiArr(data);
      });
  }, []);

  return (
    <div className="py-5 flex flex-col gap-5 max-w-lg">
      <form className="contents">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Nama Lengkap</span>
          <input
            type="text"
            className="rounded-xl w-full px-3 py-2 border border-300"
            placeholder="Silahkan masukkan nama lengkap anggota baru"
            onChange={(e) => setNama(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Asal Titik</span>
          <input
            type="text"
            className="rounded-xl w-full px-3 py-2 border border-300"
            placeholder="Silahkan masukkan asal titik anggota baru"
            onChange={(e) => setLokasi(e.target.value)}
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
            placeholder="Silahkan masukkan status keanggotaan jama'ah"
            onChange={(e) => setStatusKeanggotaan(e.target.value)}
            list="statusList"
          />
          <datalist id="statusList">
            <option value="Anggota SA78" />
            <option value="Simpatisan" />
          </datalist>
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

            formData.append("name", nama);
            formData.append("lokasi", lokasi);
            formData.append("statusName", statusKeanggotaan);

            await fetch("/api/v1/users/create", {
              method: "POST",
              body: formData,
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  alert("Gagal menambahkan anggota baru! Server error!");
                  return;
                }

                alert("Berhasil menambahkan anggota baru!");
              });

            router.push("/anggota");
          }}
        >
          Tambah Anggota
        </button>
      </form>
      <p className="w-full text-center">or</p>
      <button
        className="py-2 rounded-xl underline underline-offset-2 hover:bg-neutral-100 transition"
        onClick={(e) => {
          // open file dialog
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".xlsx";
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            await fetch("/api/v1/users/create/bulk", {
              method: "POST",
              body: formData,
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  alert("Gagal mengimport data! Server error!");
                  return;
                }

                alert("Berhasil mengimport data!");
              });

            router.push("/anggota");
          };

          input.click();
        }}
      >
        Import Excel
      </button>
    </div>
  );
}
