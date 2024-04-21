import OpenAI from 'openai';
import { OpenAIStream } from 'ai';
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream } from 'ai';
import { experimental_buildAnthropicPrompt } from 'ai/prompts';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function getOpneAIText({content, history}:{ content: string, history:{}} ):Promise<ReadableStreamDefaultReader> {

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


const anthropic = new Anthropic()

const stream1 = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  max_tokens: 3000,
  temperature: 0,
  stream : true,
  system: `You're a subagent who help explain specific query of user based ongoing converstation. You'll be given summarized history with query. Also with context that may or maynot be useful. When asked for response in gujarati, please use gujarati language as the students' mothertounge is gujarati.So they have better comprehsion in Gujarati.
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
