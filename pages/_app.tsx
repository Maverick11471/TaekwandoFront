import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/sonner"; // Toaster 가져오기

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
