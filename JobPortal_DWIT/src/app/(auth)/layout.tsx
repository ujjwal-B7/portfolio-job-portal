import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Authentication",
    default: "Authentication",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="auth-layout-background min-h-screen w-full flex items-center justify-center py-4">
        {children}
      </div>
    </>
  );
}
