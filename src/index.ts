import { config } from 'dotenv';

config();

import OpenAI from 'openai';
import Assistant from './assistants/Assistant';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantOptions: OpenAI.Beta.Assistants.AssistantCreateParams = {
  model: 'gpt-3.5-turbo',
  tools: [
    {
      type: 'function',
      function: {
        name: 'sumTest',
        description: 'Sum two numbers',
        parameters: {
          type: 'object',
          properties: {
            a: {
              type: 'number',
              description: 'First number',
            },
            b: {
              type: 'number',
              description: 'Second number',
            },
          },
          required: ['a', 'b'],
        },
      },
    },
  ],
};

const assistant = new Assistant({
  assistantId: 'asst_eXxBGOVcIZ8o4fuJcscn4y6d',
  threadId: 'thread_ewM6Kl5Vc4JuuO2x5fO8WCis',
  client,
  options: assistantOptions,
  functions: {
    sumTest: ({ a, b }: { a: number; b: number }) => a + b,
  },
  onNewThreadCreated: (threadId: string) => {
    console.log('new thread created', threadId);
  },
});

assistant
  .getCompletion('Sum 10 and 350')
  .then((completion) => {
    console.log('completion', completion);
  })
  .catch((err: unknown) => {
    if (err instanceof Error) console.error(err.message);
    else console.error(err);
  });
