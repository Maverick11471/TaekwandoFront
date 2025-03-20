import { LoginForm } from "@/components/ui/login-form";
import "../app/globals.css";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          경희대 최강 태권도
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
