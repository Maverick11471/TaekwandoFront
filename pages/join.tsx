import React from "react";
import "../app/globals.css";
import JoinForm from "@/components/ui/join-form";
import Link from "next/link";

function Login() {
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm flex flex-col items-center">
          <Link
            href="/"
            className="flex items-center gap-2 self-center font-medium mt-3"
          >
            경희대 최강 태권도
          </Link>

          <JoinForm />
        </div>
      </div>
    </>
  );
}

export default Login;
