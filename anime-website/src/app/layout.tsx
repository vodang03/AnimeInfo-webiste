// app/layout.tsx
import { UserProvider } from "@/contexts/UserContext";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Anime Website",
  description: "Thông tin anime và phòng thảo luận",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <AppShell>{children}</AppShell>
        </UserProvider>
      </body>
    </html>
  );
}
