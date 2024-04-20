import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getAIState, getMutableAIState } from 'ai/rsc';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function getOpneAIText({content, history}:{ content: string, history:{}} ):Promise<ReadableStreamDefaultReader> {

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      {role: 'system', content: `
      your task is explain the topic in simple terms. 
      Break it down in smaller steps.
      Explain step by step.
      Reveal each step and ask if user follows.
      if no, explain further
      if yes, explain next step.
      `},
      { role: 'user', content: content }],
  });

  return OpenAIStream(response).getReader()
  // Returns a Response with the stream as the body,
  // status code 200,
  // and headers 'Content-Type': 'text/plain; charset=utf-8' and 'X-RATE-LIMIT': 'lol'.
}