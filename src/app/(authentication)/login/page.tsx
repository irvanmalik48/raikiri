import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="w-full min-h-screen px-5 py-12 flex items-center justify-center flex-col gap-3 max-w-sm mx-auto">
      <h1 className="font-semibold text-2xl w-full text-center">Login</h1>
      <div className="w-full p-5 flex flex-col gap-5 bg-neutral-100 rounded-xl">
        <LoginForm />
      </div>
    </main>
  );
}
