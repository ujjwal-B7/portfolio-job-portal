import ClientUserLayout from "./(layout)/ClientUserLayout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientUserLayout>{children}</ClientUserLayout>;
}
