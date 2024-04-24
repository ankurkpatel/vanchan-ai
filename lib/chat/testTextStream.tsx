import OpenAI from 'openai';
import { OpenAIStream } from 'ai';
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream } from 'ai';
import { experimental_buildAnthropicPrompt } from 'ai/prompts';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export async function getOpneAIText({content, history}:{ content: string, history: Message[] } ):Promise<ReadableStreamDefaultReader> {

  // console.log('console content updated \n',content)
  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4',
  //   stream: true,
  //   messages: [
  //     {role: 'system', content: `
  //     your task is explain the topic in simple terms. 
  //     Break it down in smaller steps.
  //     Explain step by step.
  //     Reveal each step and ask if user follows.
  //     if no, explain further
  //     if yes, explain next step.
  //     `},
  //     { role: 'user', content: content }],
  // });

  // return OpenAIStream(response).getReader()
  // Returns a Response with the stream as the body,
  // status code 200,
  // and headers 'Content-Type': 'text/plain; charset=utf-8' and 'X-RATE-LIMIT': 'lol'.


// const historyAnthropicPrompt = experimental_buildAnthropicPrompt(history)
// console.log( history.slice(0, -1)
// .map((message: any) => (JSON.stringify({
//   role: message.role,
//   content: message.content,
//   name: message.name
// }))))

const anthropic = new Anthropic()

const stream1 = await anthropic.messages.create({
  model: "claude-3-haiku-20240307",
  max_tokens: 3000,
  temperature: 0,
  stream : true,
  system: ` You're a subagent asked to answer question based on context and conversation history. 

  When responding to a user query, you should first analyze the query to determine if a direct answer or a more detailed explanation is appropriate. If a direct answer is sufficient, provide a concise yet informative response that addresses the query.

If a more detailed explanation is required, generate a modular explanation designed to ignite the user's curiosity and encourage further engagement. Break down the explanation into manageable chunks and tailor the content to the user's level of understanding.

Throughout the interaction, maintain an awareness of the conversation history to ensure that your responses are contextually appropriate and build upon previous information exchanged.

Your goal is to strike a balance between providing sufficient information to address the user's needs while avoiding excessive verbosity that could overwhelm or disengage the user. Tailor your responses to be concise, engaging, and tailored to the user's level of understanding.

Avoid mentioned based on provided context like phrase, users doesn't need to know how you're answering the question. 
  `,
  messages: [  
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": content
        }
      ]
    }
  ]
});


return AnthropicStream(stream1).getReader();

}
