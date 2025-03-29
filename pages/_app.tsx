import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/sonner"; // Toaster 가져오기
import { Provider } from "react-redux";
import { store } from "../app/store/store";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <Component {...pageProps} />
        <Toaster />
      </Provider>
    </>
  );
}
