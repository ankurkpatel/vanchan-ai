import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  render,
  createStreamableValue
} from 'ai/rsc'
import OpenAI from 'openai'

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
  Stock,
  Purchase
} from '@/components/stocks'

import { z } from 'zod'
import { Events } from '@/components/stocks'
import { StocksSkeleton } from '@/components/stocks/stocks-skeleton'
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat } from '@/lib/types'
import { auth } from '@/auth'
import { MultipleChoiceQuiz } from '@/components/stocks/multiple-choice-questions'
import { getContext } from './pineconeActions'
import { getOpneAIText } from './testTextStream'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})


async function confirmPurchase(symbol: string, price: number, amount: number) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>
    )

    await sleep(1000)

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{' '}
          {formatNumber(amount * price)}
        </p>
      </div>
    )

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
        {formatNumber(amount * price)}.
      </SystemMessage>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages.slice(0, -1),
        {
          id: nanoid(),
          role: 'function',
          name: 'showStockPurchase',
          content: JSON.stringify({
            symbol,
            price,
            defaultAmount: amount,
            status: 'completed'
          })
        },
        {
          id: nanoid(),
          role: 'system',
          content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
            amount * price
          }]`
        }
      ]
    })
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}

async function submitUserMessage({
  content,
  scope
}: {
  content: string
  scope: { id: string; book: string }
}) {
  'use server'

  // console.log('inside submitMessage', scope)

  // const contentWithContext = content

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const ui = render({
    model: 'gpt-3.5-turbo',
    provider: openai,
    initial: <SpinnerMessage />,
    messages: [
      {
        role: 'system',
        content: `\
you're name is Dobu - ai study buddy. You will help answer any questions about ${scope.book}

You are an intelligent agent tasked with providing concise yet engaging responses to general user queries. Your primary objectives are:

1. Provide modular responses that avoid overwhelming users with excessively verbose information.
2. Generate explanations and exercise materials tailored to the user's level of understanding, following principles of deliberate practice and effective teaching.
3. Adopt the role of an ideal teacher: wise, patient, and capable of generating student-specific explanations and exercises that are broken down into simple, manageable chunks.

You have access to the user's question, any relevant context like previous conversation history. 

Decide if the question can likely be answered with current context or if external information retrieval is needed from ${scope.book}. If required call function: showAnswerBasedOnBook

When responding to a user query, you should first analyze the query to determine if a direct answer or a more detailed explanation is appropriate. If a direct answer is sufficient, provide a concise yet informative response that addresses the query.

If a more detailed explanation is required, generate a modular explanation designed to ignite the user's curiosity and encourage further engagement. Break down the explanation into manageable chunks and tailor the content to the user's level of understanding.

Throughout the interaction, maintain an awareness of the conversation history to ensure that your responses are contextually appropriate and build upon previous information exchanged.

Your goal is to strike a balance between providing sufficient information to address the user's needs while avoiding excessive verbosity that could overwhelm or disengage the user. Tailor your responses to be concise, engaging, and tailored to the user's level of understanding.

Aslo you can ask questions in addition to answer or part of answer to engage the user. Maximize the engagements.
`
      },
      ...aiState
        .get()
        .messages.slice(0, -1)
        .map((message: any) => ({
          role: message.role,
          content: message.content,
          name: message.name
        })),
      ...aiState
        .get()
        .messages.slice(-1)
        .map(message => ({
          role: message.role,
          content: content,
          name: message.name
        }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content: content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }
      return textNode
    },
    functions: {
      multipleChoiceQuestions: {
        description:
          'generate a list of 5 mutiple choice questions to test students understanding',
        parameters: z.object({
          questions: z
            .array(
              z.object({
                id: z
                  .string()
                  .describe('The unique identifier for the question'),
                text: z.string().describe('The text of the question'),
                choices: z
                  .array(
                    z.object({
                      label: z
                        .string()
                        .describe('The label for the choice option'),
                      value: z
                        .string()
                        .optional()
                        .describe('The value for the choice option (optional)')
                    })
                  )
                  .nonempty()
                  .describe('The choices for the question'),
                answer: z
                  .string()
                  .describe('The correct answer for the question')
              })
            )
            .nonempty()
            .describe('The array of multiple-choice questions')
        }),
        render: async function* ({ questions }) {
          yield (
            <BotCard>
              <StocksSkeleton />
            </BotCard>
          )

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'multipleChoiceQuestions',
                content: JSON.stringify({ questions })
              }
            ]
          })

          return (
            <BotCard>
              <MultipleChoiceQuiz questions={questions} />
            </BotCard>
          )
        }
      },
      showAnswerBasedOnContext:{
        description :'Provides answer based on retrieving additional information from the book. ',
        parameters : z.object({
        queryToDB : z.string().describe('information needed from the book'),
        prompt : z.string().describe('question asked by the user')   
        }),
        render : async function* ({queryToDB, prompt}){
         
          let textStreamT = createStreamableValue('')
          let textNodeT =<BotMessage content={textStreamT.value} />
          yield(textNodeT)
          
          yield(<SpinnerMessage/>)

          const contentWithContext = await getContext({prompt : queryToDB , page : "", scope: scope.id })
         
           
          const reader= await getOpneAIText({content: contentWithContext, history: aiState.get().messages})

          yield(textNodeT)

          let concatedResponse: string  = ''

          while (true) {
           
            const { value, done } = await reader.read();
           

            if (done) {
              console.log('Stream complete');
              textStreamT.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content: concatedResponse
            }
          ]
        })
              break;
            }
        
            // Convert the Uint8Array chunk to a string
            const chunk = new TextDecoder().decode(value);
            concatedResponse+= chunk
            textStreamT.update(chunk)
          } 
          
          return textNodeT

        }

      },
    }
  })

  return {
    id: nanoid(),
    display: ui
  }
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    confirmPurchase
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  unstable_onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  unstable_onSetAIState: async ({ state, done }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`
      const title = messages[0].content.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display: (() => {
        switch (message.role) {
          case 'function':
            switch (message.name) {
              case 'multipleChoiceQuestions':
                return (
                  <BotCard>
                    <MultipleChoiceQuiz
                      questions={JSON.parse(message.content).questions}
                    />
                  </BotCard>
                )
              case 'showStockPrice':
                return (
                  <BotCard>
                    <Stock props={JSON.parse(message.content)} />
                  </BotCard>
                )
              case 'showStockPurchase':
                return (
                  <BotCard>
                    <Purchase props={JSON.parse(message.content)} />
                  </BotCard>
                )
              case 'getEvents':
                return (
                  <BotCard>
                    <Events props={JSON.parse(message.content)} />
                  </BotCard>
                )
              default:
                return null
            }
          case 'user':
            return <UserMessage>{message.content}</UserMessage>
          default:
            return <BotMessage content={message.content} />
        }
      })()
    }))
}
