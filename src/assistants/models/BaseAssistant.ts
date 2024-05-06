import type { OpenAI } from 'openai';
import { IAssistant } from './IAssistant';

export abstract class BaseAssistant implements IAssistant {
  options;
  client;
  threadId;
  assistantId;
  functions;
  onNewThreadCreated?: (threadId: string) => void = () => {};

  constructor({
    client,
    options = {},
    threadId,
    assistantId,
    functions,
    onNewThreadCreated,
  }: {
    assistantId: string;
    client: OpenAI;
    options?: Partial<OpenAI.Beta.AssistantCreateParams>;
    threadId?: string;
    functions?: Record<string, Function>;
    onNewThreadCreated?: (threadId: string) => void;
  }) {
    this.options = options;
    this.client = client;
    this.threadId = threadId;
    this.assistantId = assistantId;
    this.functions = functions;
    this.onNewThreadCreated = onNewThreadCreated;
  }

  abstract getCompletion(
    userMessage: string,
    options?: OpenAI.Beta.AssistantCreateParams
  ): Promise<string | undefined>;

  async getMessages(threadId?: string) {
    if (!this.threadId) {
      if (!threadId) {
        throw new Error('Thread ID not set');
      } else {
        this.threadId = threadId;
      }
    }

    /**
     * Get messages from the thread
     * @description The parameter `threadId` is optional, if not provided, it will use the thread ID from the instance. If the thread ID is not set in the instance, it will throw an error. The `threadId` will have priority over the instance thread ID.
     * @param threadId The thread ID to get messages from
     * @returns The messages from the thread
     */
    const messages = await this.client.beta.threads.messages.list(
      // This permits the user to get messages from a different thread when is needed
      threadId ?? this.threadId,
      {
        order: 'asc',
      }
    );
    return messages.data;
  }
}
