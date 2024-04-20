import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function getOpneAIText(content: string):Promise<ReadableStreamDefaultReader> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [{ role: 'user', content: content }],
  });

  return OpenAIStream(response).getReader()
  // Returns a Response with the stream as the body,
  // status code 200,
  // and headers 'Content-Type': 'text/plain; charset=utf-8' and 'X-RATE-LIMIT': 'lol'.
}