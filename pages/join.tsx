import React from "react";

import JoinForm from "@/components/ui/join-form";

function Login() {
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <JoinForm />
        </div>
      </div>
    </>
  );
}

export default Login;
