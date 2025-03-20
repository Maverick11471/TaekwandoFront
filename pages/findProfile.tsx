import React from "react";
import "../app/globlas.css";

import FindProfileForm from "@/components/ui/findProfile-form";

function FindProfile() {
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <FindProfileForm />
        </div>
      </div>
    </>
  );
}

export default FindProfile;
