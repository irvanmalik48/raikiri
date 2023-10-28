import Sidebar from "@/components/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex w-full min-h-screen">
      <Sidebar />
      <section className="w-full min-h-screen p-5">{children}</section>
    </main>
  );
}
