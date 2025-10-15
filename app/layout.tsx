import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ChatsProvider } from "@/lib/chat-store/chats/provider"
import { ChatSessionProvider } from "@/lib/chat-store/session/provider"
import { ModelProvider } from "@/lib/model-store/provider"
import { TanstackQueryProvider } from "@/lib/tanstack-query/tanstack-query-provider"
import { UserPreferencesProvider } from "@/lib/user-preference-store/provider"
import { UserProvider } from "@/lib/user-store/provider"
import { getUserProfile } from "@/lib/user/api"
import { ThemeProvider } from "next-themes"
import Script from "next/script"
import { LayoutClient } from "./layout-client"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Tomato",
  description:
    "Tomato is the open-source interface for AI chat. Multi-model, BYOK-ready, and fully self-hostable. Use Claude, OpenAI, Gemini, local models, and more, all in one place.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDev = process.env.NODE_ENV === "development"
  const isOfficialDeployment = process.env.ZOLA_OFFICIAL === "true"
  const userProfile = await getUserProfile()

  return (
    <html lang="en" suppressHydrationWarning>
      {isOfficialDeployment ? (
        <Script
          defer
          src="https://assets.onedollarstats.com/stonks.js"
          {...(isDev ? { "data-debug": "tomatoo.icu" } : {})}
        />
      ) : null}
      <body className={`${outfit.variable} antialiased`}>
        <TanstackQueryProvider>
          <LayoutClient />
          <UserProvider initialUser={userProfile}>
            <ModelProvider>
              <ChatsProvider userId={userProfile?.id}>
                <ChatSessionProvider>
                  <UserPreferencesProvider
                    userId={userProfile?.id}
                    initialPreferences={userProfile?.preferences}
                  >
                    <TooltipProvider
                      delayDuration={200}
                      skipDelayDuration={500}
                    >
                      <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                      >
                        <SidebarProvider defaultOpen>
                          <Toaster position="top-center" />
                          {children}
                        </SidebarProvider>
                      </ThemeProvider>
                    </TooltipProvider>
                  </UserPreferencesProvider>
                </ChatSessionProvider>
              </ChatsProvider>
            </ModelProvider>
          </UserProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
