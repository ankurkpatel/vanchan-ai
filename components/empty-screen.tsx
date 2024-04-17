import { UseChatHelpers } from 'ai/react'
import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'
import { useScope } from '@/lib/hooks/use-scope'
import { FooterText } from './footer'


export function EmptyScreen() {
  const {scope, updateScope } = useScope()
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Meet Dobu, an AI Helper!
        </h1>
        <p className="leading-normal text-muted-foreground">
          Struggling to grasp complex topics? Confused by difficult concepts?
        </p>
        <p className="leading-normal text-muted-foreground">
          {`Ask me and I'll help you understand anything.`}
        </p> 
        <FooterText setSelectScope={updateScope}/>
      </div>
    </div>
  )
}
