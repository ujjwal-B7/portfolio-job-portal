import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import StoreProvider from "@/providers/StoreProvider";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import NextAuthProvider from "@/providers/SessionProvider";

import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";
import Script from "next/script";

import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Deerwalk Jobs",
    default: "Deerwalk Jobs",
  },
  description: "DWC Job Center",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: Session | null = await getServerSession(options);
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LDV02Z5YJE"
        ></Script>
        <Script id="google-analytics">
          {`window.dataLayer = window.dataLayer || [];
          function gtag() {
              dataLayer.push(arguments);
          }
          gtag('js', new Date());
          
          gtag('config', 'G-LDV02Z5YJE');`}
        </Script>
      </head>
      <body className={inter.className}>
        <NextTopLoader
          color="#0f5288"
          crawlSpeed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          height={4}
          initialPosition={0.4}
        />
        <NextAuthProvider session={session}>
          <StoreProvider>
            <main>{children}</main>
          </StoreProvider>
        </NextAuthProvider>
        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </body>
    </html>
  );
}
