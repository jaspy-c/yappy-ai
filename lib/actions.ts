'use server';

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function getSpaces(pageText: string) {
  const prompt = `Please add spaces to the following text where necessary:\n\n${pageText}`;
  const { text, finishReason, usage } = await generateText({
    model: openai('gpt-3.5-turbo'),
    prompt: prompt,
  });

  return { text, finishReason, usage };
}
