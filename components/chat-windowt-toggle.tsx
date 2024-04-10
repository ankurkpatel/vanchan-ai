'use client'

import * as React from 'react'

import { useSidebar } from '@/lib/hooks/use-sidebar'
import { Button } from '@/components/ui/button'
import { IconMessage } from '@/components/ui/icons'
import { useChatWindow } from '@/lib/hooks/use-chat-window'

export function ChatWindowToggle() {
  const { toggleChatWindow } = useChatWindow()

  return (
    <Button
      variant="ghost"
      className="-ml-2 hidden size-9 p-0 lg:flex"
      onClick={() => {
        toggleChatWindow()
      }}
    >
      <IconMessage className="size-6" />
      <span className="sr-only">Toggle Chat Window</span>
    </Button>
  )
}