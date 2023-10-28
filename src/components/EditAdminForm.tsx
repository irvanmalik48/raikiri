"use client";

import { useState } from "react";

export default function AddAnggotaForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form className="py-5 flex flex-col gap-5 max-w-lg">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Username</span>
        <input
          type="text"
          className="rounded-xl w-full px-3 py-2 border border-300"
          placeholder="Silahkan masukkan username baru"
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Password Baru</span>
        <input
          type="password"
          className="rounded-xl w-full px-3 py-2 border border-300"
          placeholder="Silahkan masukkan password baru"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Konfirmasi Password</span>
        <input
          type="password"
          className="rounded-xl w-full px-3 py-2 border border-300"
          placeholder="Silahkan masukkan konfirmasi password baru"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button
        className="rounded-xl bg-black hover:bg-neutral-900 transition text-white py-2"
        onClick={async (e) => {
          e.preventDefault();

          if (!username || !password || !confirmPassword) {
            alert("Mohon isi semua field!");
            return;
          }

          const formData = new FormData();

          formData.append("username", username);
          formData.append("password", password);

          if (password !== confirmPassword) {
            alert("Password tidak sama!");
            return;
          }

          await fetch("/api/v1/admin/edit", {
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

          setUsername("");
          setPassword("");
          setConfirmPassword("");
        }}
      >
        Simpan Perubahan
      </button>
    </form>
  );
}
