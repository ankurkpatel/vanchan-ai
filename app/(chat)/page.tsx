import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '../actions'
import Reader from "@/components/reader"

export const metadata = {
  title: 'Next.js AI Chatbot'
}
export const maxDuration = 60

export default async function IndexPage() {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()
 

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      {/* <Reader id={id} session={session} missingKeys={missingKeys} /> */}
      <Chat id={id} session={session} missingKeys={missingKeys} /> 
    </AI>
  )
}
