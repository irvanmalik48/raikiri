"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lokasi } from "@prisma/client";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function AddAnggotaForm() {
  const [nama, setNama] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [waktu, setWaktu] = useState<Value>(new Date());
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
    <form className="py-5 flex flex-col gap-5 max-w-lg">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Nama Giat</span>
        <input
          type="text"
          className="rounded-xl w-full px-3 py-2 border border-300"
          placeholder="Silahkan masukkan nama giat yang akan dilaksanakan"
          onChange={(e) => setNama(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Lokasi</span>
        <input
          type="text"
          className="rounded-xl w-full px-3 py-2 border border-300"
          placeholder="Silahkan masukkan lokasi kegiatan"
          onChange={(e) => setLokasi(e.target.value)}
          list="lokasiList"
        />
        <datalist id="lokasiList">
          {lokasiArr.map((lokasi, i) => (
            <option key={i} value={lokasi.name as string} />
          ))}
        </datalist>
      </label>
      <label className="flex flex-col w-full items-center justify-center gap-1">
        <span className="text-sm font-semibold">Tanggal Giat</span>
        <Calendar onChange={setWaktu} value={waktu} />
      </label>
      <button
        className="rounded-xl bg-black hover:bg-neutral-900 transition text-white py-2"
        onClick={async (e) => {
          e.preventDefault();

          if (!nama || !lokasi || !waktu) {
            alert("Mohon isi semua field!");
            return;
          }

          const formData = new FormData();

          formData.append("name", nama);
          formData.append("lokasi", lokasi);
          formData.append("waktu", new Date(waktu as Date).toISOString());

          await fetch("/api/v1/giat/create", {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                alert("Gagal menambahkan giat baru! Server error!");
                return;
              }

              alert("Berhasil menambahkan giat baru!");
            });

          router.push("/kegiatan");
        }}
      >
        Tambah Anggota
      </button>
    </form>
  );
}
