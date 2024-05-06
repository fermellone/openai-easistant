import { BaseAssistant } from './models/BaseAssistant';

export default class StreamingAssistant extends BaseAssistant {
  async getCompletion(userMessage: string) {
    try {
      return '';
    } catch (err) {
      throw err;
    }
  }
}
