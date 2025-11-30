'use server';

/**
 * @fileOverview AI-powered interaction suggestion agent.
 *
 * - suggestInteraction - A function that suggests prompts or next steps for client interactions.
 * - SuggestInteractionInput - The input type for the suggestInteraction function.
 * - SuggestInteractionOutput - The return type for the suggestInteraction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInteractionInputSchema = z.object({
  clientDescription: z
    .string()
    .describe('Description of the client, their needs and history.'),
  previousInteractions: z
    .string()
    .describe(
      'A summary of previous interactions with the client, including successful actions.'
    ),
  currentGoal: z
    .string()
    .describe(
      'The current goal for the interaction, e.g., closing a deal, scheduling a meeting, etc.'
    ),
});
export type SuggestInteractionInput = z.infer<typeof SuggestInteractionInputSchema>;

const SuggestInteractionOutputSchema = z.object({
  suggestion: z
    .string()
    .describe(
      'A suggested prompt or next step for the interaction, based on successful actions from previous customer interactions.'
    ),
});
export type SuggestInteractionOutput = z.infer<typeof SuggestInteractionOutputSchema>;

export async function suggestInteraction(
  input: SuggestInteractionInput
): Promise<SuggestInteractionOutput> {
  return suggestInteractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInteractionPrompt',
  input: {schema: SuggestInteractionInputSchema},
  output: {schema: SuggestInteractionOutputSchema},
  prompt: `You are an AI assistant designed to suggest prompts and next steps for client interactions.

  Based on the client description, previous interactions, and current goal, suggest a prompt or next step that is likely to lead to a successful outcome.

  Client Description: {{{clientDescription}}}
  Previous Interactions: {{{previousInteractions}}}
  Current Goal: {{{currentGoal}}}

  Suggestion:`,
});

const suggestInteractionFlow = ai.defineFlow(
  {
    name: 'suggestInteractionFlow',
    inputSchema: SuggestInteractionInputSchema,
    outputSchema: SuggestInteractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
