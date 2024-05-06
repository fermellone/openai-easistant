import OpenAI from 'openai';

export interface IAssistant {
  options?: Partial<OpenAI.Beta.AssistantCreateParams>;
  client: OpenAI;
  threadId?: string;
  assistantId?: string;
  functions?: Record<string, Function>;
  onNewThreadCreated?: (threadId: string) => void;

  getCompletion(
    userMessage: string,
    options?: OpenAI.Beta.AssistantCreateParams
  ): Promise<string | undefined>;

  getMessages(): Promise<OpenAI.Beta.Threads.Messages.Message[]>;
}
