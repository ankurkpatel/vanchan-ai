'use client'

import * as React from 'react'

const LOCAL_STORAGE_KEY = 'chat-window'

interface ChatWindowContext {
  isChatWindowOpen: boolean
  toggleChatWindow: () => void
  isLoading: boolean
}

const ChatWindowContext = React.createContext<ChatWindowContext | undefined>(
  undefined
)

export function useChatWindow() {
  const context = React.useContext(ChatWindowContext)
  if (!context) {
    throw new Error('ChatWindowContext must be used within a ChatWindowProvider')
  }
  return context
}

interface ChatWindowProviderProps {
  children: React.ReactNode
}

export function ChatWindowProvider({ children }: ChatWindowProviderProps) {
  const [isChatWindowOpen, setChatWindowOpen] = React.useState(true)
  const [isLoading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (value) {
        setChatWindowOpen(JSON.parse(value))
    }
    setLoading(false)
  }, [])

  const toggleChatWindow = () => {
    setChatWindowOpen(value => {
      const newState = !value
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState))
      return newState
    })
  }

  if (isLoading) {
    return null
  }

  return (
    <ChatWindowContext.Provider
      value={{ isChatWindowOpen, toggleChatWindow, isLoading }}
    >
      {children}
    </ChatWindowContext.Provider>
  )
}
