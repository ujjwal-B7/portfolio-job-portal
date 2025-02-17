import AuthForm from "@/components/auth/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLogin() {
  return <AuthForm type="login" authenticateAs="admin" />;
}
