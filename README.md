# Assistant Class Implementation Guide

The `Assistant` class is a part of the `assistants` module. It extends the `BaseAssistant` class and provides an interface to interact with OpenAI's GPT-4 model.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm.
- You have a basic understanding of TypeScript.

## Implementing the Self-created Assistant Class

> This assistant doesn't need to be created at the ["Assistants" interface](https://platform.openai.com/)

1. **Import the Assistant class**

   First, you need to import the `Assistant` class from the `assistants` module.

   ```typescript
   import Assistant from './assistants/Assistant';
   ```

2. **Create an instance of the Assistant instance**

   You can create a new instance of the `Assistant` class, passing the "assistantId" as argument.

   ```typescript
   const assistant = new Assistant(ASSISTANT_ID);
   ```

3. **Use the getCompletion method**

   The `getCompletion` method is used to get the completion of a user's message. It takes in a user message as a string and an optional options object.

   ```typescript
   const userMessage = 'Hello, world!';
   const completion = await assistant.getCompletion(userMessage);
   console.log(completion);
   ```

   The `getCompletion` method returns the last message from the assistant. If the last message is of type 'text', it returns the text value. Otherwise, it returns an empty string.

### Error Handling

The `getCompletion` method uses a try-catch block to handle any errors that may occur during the execution of the assistant. If an error occurs, it is thrown and should be handled by the calling code.

### Private Methods

The `Assistant` class also contains private methods like `#handleRequiresAction` which are not accessible directly and are used internally by the class.
