"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store/store";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let persistor = persistStore(store);

  useEffect(() => {
    AOS.init({
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </>
  );
}
