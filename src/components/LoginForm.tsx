"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  return (
    <form className="flex flex-col gap-5 w-full">
      <label className="flex flex-col gap-1">
        <span>Username</span>
        <input
          type="text"
          className="rounded-xl w-full px-3 py-2"
          placeholder="Username"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span>Password</span>
        <input
          type={visible ? "text" : "password"}
          className="rounded-xl w-full px-3 py-2"
          placeholder="Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="show-pass" className="w-full flex gap-2">
          <input
            type="checkbox"
            id="show-pass"
            className="rounded-xl"
            onClick={() => setVisible(!visible)}
          />
          <span className="select-none">Show password</span>
        </label>
      </label>
      <button
        type="submit"
        className="rounded-xl bg-black hover:bg-neutral-900 transition text-white py-2"
        onClick={async (e) => {
          e.preventDefault();

          const form = new FormData();

          form.append("username", username);
          form.append("password", password);

          const res = await fetch("/api/v1/admin/authenticate", {
            method: "POST",
            body: form,
          });

          const data = await res.json();

          if (data.auth) {
            router.push("/");
          } else {
            alert("Username atau password salah");
          }
        }}
      >
        Login
      </button>
    </form>
  );
}
