import { UseChatHelpers } from 'ai/react'
import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'
import { useScope } from '@/lib/hooks/use-scope'
import { FooterText } from './footer'
import { TextTypingEffectWithTextsFadeOut } from './text-effect'


export function EmptyScreen() {
  const {scope, updateScope } = useScope()
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        {/* <h1 className="text-base sm:text-lg font-semibold">
          Meet Dobu, an AI Helper!
        </h1>
        <p className="leading-snug sm:leading-normal text-muted-foreground text-sm sm:text-base">
          Struggling to grasp complex topics? Confused by difficult concepts?
        </p>
        <p className="leading-snug sm:leading-normal text-muted-foreground text-sm sm:text-base">
          {`Ask me and I'll help you understand anything.`}
        </p> */}
       <p><TextTypingEffectWithTextsFadeOut/></p>

        <FooterText setSelectScope={updateScope}/>
      </div>
    </div>
  )
}
