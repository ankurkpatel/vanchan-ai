'use client'
import { useChatWindow } from "@/lib/hooks/use-chat-window"
import { Chat, ChatProps } from "./chat"



const Reader = ({id, session, missingKeys} : ChatProps) => {
    const {isChatWindowOpen, toggleChatWindow} = useChatWindow()

    return (
    <div className="flex w-full bg-background">
   { isChatWindowOpen && <div className="md:w-8/12">

    </div>}
    <div className={`${isChatWindowOpen ? 'md:w-4/12' : ''} mx-auto`}>
    <Chat id={id} session={session} missingKeys={missingKeys} />
    </div>
    </div>
    )

}

export default Reader