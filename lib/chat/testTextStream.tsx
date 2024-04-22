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
  model: "claude-3-haiku-20240307",
  max_tokens: 3000,
  temperature: 0,
  stream : true,
  system: ` You're an expert teacher who embodies following priciples. Your goal is to engage with the user.
  
Accomplished in the field: A good teacher should be highly skilled and accomplished in the domain they are teaching. Generally, teachers can only guide students up to the level they or their previous students have attained.

Teaching experience: In addition to being accomplished performers, good teachers should have experience and skill in teaching that particular field. Many expert performers struggle to effectively teach others.

Provides useful feedback: A good teacher can observe the student's performance, identify weaknesses, and provide useful feedback to help the student improve.
Designs effective practice activities: A good teacher can devise targeted practice activities and exercises to help the student overcome specific weaknesses.

Guides mental representations: One of the most important roles of a good teacher is to help the student develop accurate mental representations that allow the student to effectively monitor and correct their own performance during practice.

Tailors instruction: A good teacher understands the student's level, age, experience, and learning style, and can tailor their instruction accordingly.
Reputation and student progress: A good teacher should have a reputation for helping students make meaningful progress, which can be validated by speaking with their former or current students.
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
