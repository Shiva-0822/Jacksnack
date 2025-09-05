'use server';
/**
 * @fileOverview Summarizes customer feedback from contact forms to identify common issues.
 *
 * - summarizeProductFeedback - A function that summarizes product feedback.
 * - SummarizeProductFeedbackInput - The input type for the summarizeProductFeedback function.
 * - SummarizeProductFeedbackOutput - The return type for the summarizeProductFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeProductFeedbackInputSchema = z.object({
  feedback:
    z.string().describe('Customer feedback text from contact forms.'),
});
export type SummarizeProductFeedbackInput = z.infer<typeof SummarizeProductFeedbackInputSchema>;

const SummarizeProductFeedbackOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the customer feedback.'),
});
export type SummarizeProductFeedbackOutput = z.infer<typeof SummarizeProductFeedbackOutputSchema>;

export async function summarizeProductFeedback(
  input: SummarizeProductFeedbackInput
): Promise<SummarizeProductFeedbackOutput> {
  return summarizeProductFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeProductFeedbackPrompt',
  input: {schema: SummarizeProductFeedbackInputSchema},
  output: {schema: SummarizeProductFeedbackOutputSchema},
  prompt: `Summarize the following customer feedback to identify common issues and areas for product improvement.\n\nFeedback: {{{feedback}}}`,
});

const summarizeProductFeedbackFlow = ai.defineFlow(
  {
    name: 'summarizeProductFeedbackFlow',
    inputSchema: SummarizeProductFeedbackInputSchema,
    outputSchema: SummarizeProductFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
