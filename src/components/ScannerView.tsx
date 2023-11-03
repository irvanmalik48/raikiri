"use client";

import { Giat } from "@prisma/client";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";

export default function ScannerView() {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [giatData, setGiatData] = useState<Giat[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    fetch(`/api/v1/giat`)
      .then((res) => res.json())
      .then((data) => {
        setGiatData(data);
      });
  });

  return (
    <div className="flex flex-col bg-neutral-100 gap-5 mx-auto w-full max-w-xl items-center justify-center p-5 rounded-xl">
      <label className="w-full flex flex-col items-center gap-1 justify-center">
        <p className="w-full text-left font-semibold text-sm">
          Pilih kegiatan yang ingin diikuti oleh jama&apos;ah
        </p>
        <select
          className="rounded-xl w-full px-3 py-2 border border-300"
          onChange={(e) => setSelectedId(e.target.value)}
          value={selectedId}
        >
          <option value="">Pilih giat</option>
          {giatData.map((giat, i) => (
            <option key={i} value={giat.id}>
              {giat.name}
            </option>
          ))}
        </select>
      </label>
      <QrScanner
        containerStyle={{
          backgroundColor: "transparent",
          aspectRatio: "1/1",
          borderRadius: "0.5rem",
        }}
        scanDelay={500}
        onDecode={async (data) => {
          if (selectedId === "") {
            alert("Silahkan pilih kegiatan terlebih dahulu");
            return;
          }

          setScannedData(data);

          const parsedData = {
            userId: data,
            giatId: selectedId,
            status: "HADIR",
          };

          const form = new FormData();

          form.append("userId", parsedData.userId as string);
          form.append("giatId", parsedData.giatId);
          form.append("status", parsedData.status);

          const submit = await fetch(`/api/v1/absensi/create`, {
            method: "POST",
            body: form,
          });

          if (submit.status === 200) {
            alert("Berhasil submit kehadiran");
            setScannedData(null);
            setSelectedId("");
          } else {
            alert("Gagal submit kehadiran");
            setScannedData(null);
            setSelectedId("");
          }
        }}
        onError={(err) => {
          console.log(err);
        }}
        constraints={{
          facingMode: "environment",
        }}
      />
      <p className="text-center">
        Silahkan scan kode QR di kartu jama&apos;ah sebagai tanda kehadiran di
        giat yang dipilih.
      </p>
    </div>
  );
}
