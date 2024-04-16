'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { SidebarProvider } from '@/lib/hooks/use-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ChatWindowProvider } from '@/lib/hooks/use-chat-window'
import { ScopeProvider } from '@/lib/hooks/use-scope'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <SidebarProvider>
        <ScopeProvider>
        <TooltipProvider>{children}</TooltipProvider>
        </ScopeProvider>
      </SidebarProvider>
    </NextThemesProvider>
  )
}
