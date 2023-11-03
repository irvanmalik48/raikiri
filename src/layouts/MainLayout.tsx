import Sidebar from "@/components/Sidebar";
import { cookies } from "next/headers";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies().get("token");
  let a;

  if (cookieStore) {
    // check if the token is valid
    const form = new FormData();

    form.append("token", cookieStore.value);

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"
      }/api/v1/admin/authenticate/verify`,
      {
        method: "POST",
        body: form,
      }
    );

    const data = await response.json();
    a = data;
  }

  return (
    <main className="flex w-full min-h-screen">
      {a.role === "scanner" ? "" : <Sidebar />}
      <section className="w-full min-h-screen p-5">{children}</section>
    </main>
  );
}
