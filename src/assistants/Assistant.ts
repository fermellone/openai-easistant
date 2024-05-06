import OpenAI from 'openai';
import { BaseAssistant } from './models/BaseAssistant';

export default class Assistant extends BaseAssistant {
  private pollIntervalMs: number = 2000;

  async getCompletion(
    userMessage: string,
    options: Partial<OpenAI.Beta.AssistantCreateParams> = {}
  ) {
    try {
      if (!this.threadId) {
        const newThread = await this.client.beta.threads.create();
        this.threadId = newThread.id;
        if (this.onNewThreadCreated) this.onNewThreadCreated(newThread.id);
      }

      await this.#runAssistant(userMessage, options);
      const messages = await this.getMessages();

      const lastMessage = messages[messages.length - 1];
      if (lastMessage.content[0].type === 'text') {
        return lastMessage.content[0].text.value;
      }
      return '';
    } catch (err) {
      throw err;
    }
  }

  async #handleRequiresAction(
    run: OpenAI.Beta.Threads.Run
  ): Promise<void | OpenAI.Beta.Threads.Messages.Message[]> {
    // Check if there are tools that require outputs
    if (
      run.required_action &&
      run.required_action.submit_tool_outputs &&
      run.required_action.submit_tool_outputs.tool_calls
    ) {
      let toolOutputs: OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[] =
        [];

      for (const functionCall of run.required_action.submit_tool_outputs
        .tool_calls) {
        if (!this.functions) throw new Error('Tools not set');
        const func = this.functions[functionCall.function.name];
        const args = JSON.parse(functionCall.function.arguments);
        if (!func) {
          console.error(`Tool ${functionCall.function.name} not found`);
          continue;
        }
        console.log('calling function', func.name, 'with args', args);
        const output = func(args);
        toolOutputs.push({
          tool_call_id: functionCall.id,
          output: output.toString(),
        });
      }

      // Submit all tool outputs at once after collecting them in a list
      if (toolOutputs.length > 0) {
        run = await this.client.beta.threads.runs.submitToolOutputsAndPoll(
          this.threadId!,
          run.id,
          { tool_outputs: toolOutputs }
        );
        console.log('Tool outputs submitted successfully.');
      } else {
        console.log('No tool outputs to submit.');
      }

      // Check status after submitting tool outputs
      return this.#handleRunStatus(run);
    }
  }

  async #handleRunStatus(run: OpenAI.Beta.Threads.Run) {
    // Check if the run is completed
    if (run.status === 'completed') {
      let messages = await this.client.beta.threads.messages.list(
        this.threadId!
      );
      return messages.data;
    } else if (run.status === 'requires_action') {
      return await this.#handleRequiresAction(run);
    } else {
      console.error('Run did not complete:', run);
    }
  }

  async #runAssistant(
    userMessage: string,
    options: Partial<OpenAI.Beta.AssistantCreateParams> = {}
  ) {
    try {
      if (!this.assistantId) {
        throw new Error('Assistant ID is not set');
      }
      if (!this.threadId) {
        throw new Error('Thread ID is not set');
      }

      let run = await this.client.beta.threads.runs.createAndPoll(
        this.threadId,
        {
          assistant_id: this.assistantId,
          additional_messages: [
            {
              role: 'user',
              content: userMessage,
            },
          ],
          ...options,
        },
        {
          pollIntervalMs: this.pollIntervalMs,
        }
      );

      await this.#handleRunStatus(run);
    } catch (err) {
      throw err;
    }
  }
}
