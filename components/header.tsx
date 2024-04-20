import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconGitHub,
  IconMessage,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import { Session } from '@/lib/types'
import { useChatWindow } from '@/lib/hooks/use-chat-window' 
import { ChatWindowToggle } from './chat-window-toggle'

async function UserOrLogin() {
  const session = (await auth()) as Session
  return (
  
     <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/new" rel="nofollow">
          <span>Dobu</span>
        </Link>
      )}
      <div className="flex items-center">
      
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
      </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4  shrink-0  bg-muted/50">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
        <UserOrLogin/>
        </React.Suspense>
      </header>
  )
}

//bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl -- gradient header
