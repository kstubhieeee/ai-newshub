import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navigation from '@/components/navigation';
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/session-provider";
import { UserAuthToast } from '@/components/user-auth-toast';
import { RouteGuard } from '@/components/route-guard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI NEWS HUB',
  description: 'AI-powered news aggregation and summarization platform',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            <RouteGuard>
              {children}
            </RouteGuard>
            <Toaster />
            <UserAuthToast />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}