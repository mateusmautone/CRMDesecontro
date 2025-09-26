"use server";

import { suggestInteraction } from "@/ai/flows/interaction-suggestions";
import type { SuggestInteractionInput } from "@/ai/flows/interaction-suggestions";
import { z } from "zod";

const ActionInputSchema = z.object({
  clientDescription: z.string(),
  previousInteractions: z.string(),
  currentGoal: z.string(),
});

export async function getInteractionSuggestion(
  input: SuggestInteractionInput
) {
  try {
    const validatedInput = ActionInputSchema.parse(input);
    const result = await suggestInteraction(validatedInput);
    return { success: true, suggestion: result.suggestion };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input." };
    }
    return { success: false, error: "Failed to get suggestion from AI." };
  }
}
