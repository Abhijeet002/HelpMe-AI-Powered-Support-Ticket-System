import ReduxProvider from '@/lib/redux/ReduxProvider'
import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
// import ReduxProvider from '@/providers/ReduxProvider'

export const metadata: Metadata = {
  title: 'HelpMe',
  description: 'AI-Powered Support Ticket System',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
