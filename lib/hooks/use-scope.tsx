'use client'

import { useContext, createContext, useState, useEffect } from "react"

const LOCAL_STORAGE_KEY = 'book-scope'

interface ScopeContext {
  scope: {
    id: string
    book: string
  }
  updateScope: (bookObj: { book: string; id: string }) => void
  isLoading: boolean
}

const ScopeContext = createContext<ScopeContext | undefined>(
  undefined
)

interface ScopeProviderProps {
  children: React.ReactNode
}

export function ScopeProvider({ children }: ScopeProviderProps) {
  const [scope, setScope] = useState({ book: 'Std. 12 Biology', id: 'iCpboeqPDTZ-4njSCTe_9' })
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (value) {
        setScope(JSON.parse(value))
    }
    setLoading(false)
  }, [])

  const updateScope =(bookObj:{book:string, id:string})=> {
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookObj))
    setScope(bookObj)

  }
  

  if (isLoading) {
    return null
  }

  return (
    <ScopeContext.Provider
      value={{ scope, updateScope, isLoading }}
    >
      {children}
    </ScopeContext.Provider>
  )
}

export function useScope() {
  const context = useContext(ScopeContext)
  if (!context) {
    throw new Error('BookScopeContext must be used within a BookScopeProvider')
  }
  return context
}