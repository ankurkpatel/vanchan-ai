'use client'
import { useChatWindow } from "@/lib/hooks/use-chat-window"
import { Chat, ChatProps } from "./chat"



const Reader = ({id, session, missingKeys, initialMessages} : ChatProps) => {
    const {isChatWindowOpen, toggleChatWindow} = useChatWindow()

    return (
    <div className="flex w-full bg-background overflow-auto">
   { isChatWindowOpen && <div className="md:w-8/12">

    </div>}
    <div className={`${isChatWindowOpen ? 'md:w-4/12' : ''} mx-auto overflow-auto w-full`}>
    <Chat id={id} session={session} initialMessages={initialMessages} missingKeys={missingKeys} />
    </div>
    </div>
    )

}

export default Reader