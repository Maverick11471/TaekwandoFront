import React from "react";
import "../app/globals.css";
import Link from "next/link";
import ChangePasswordForm from "@/components/ui/changePassword-form";

function changePassword() {
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm flex flex-col ">
          <Link
            href="/"
            className="flex items-center gap-2 self-center font-medium mt-3"
          >
            경희대 최강 태권도
          </Link>
          <ChangePasswordForm />
        </div>
      </div>
    </>
  );
}

export default changePassword;
