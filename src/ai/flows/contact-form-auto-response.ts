'use server';

/**
 * @fileOverview A Genkit flow for sending an automated response to users submitting the contact form.
 *
 * - contactFormAutoResponse - A function that sends an automated response email.
 * - ContactFormAutoResponseInput - The input type for the contactFormAutoResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContactFormAutoResponseInputSchema = z.object({
  name: z.string().describe('The name of the user submitting the contact form.'),
  email: z.string().email().describe('The email address of the user.'),
  message: z.string().describe('The message submitted by the user.'),
});
export type ContactFormAutoResponseInput = z.infer<typeof ContactFormAutoResponseInputSchema>;

export async function contactFormAutoResponse(input: ContactFormAutoResponseInput): Promise<void> {
  await contactFormAutoResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contactFormAutoResponsePrompt',
  input: {schema: ContactFormAutoResponseInputSchema},
  prompt: `Thank you for contacting us, {{{name}}}!\n\nWe have received your message:\n\n{{{message}}}\n\nWe will get back to you shortly at {{{email}}}.`,
});

const contactFormAutoResponseFlow = ai.defineFlow({
    name: 'contactFormAutoResponseFlow',
    inputSchema: ContactFormAutoResponseInputSchema,
    outputSchema: z.void(),
  },
  async input => {
    await prompt(input);
    // In a real application, you would send an email here using a service like SendGrid or Nodemailer.
    // This is a placeholder to indicate where the email sending logic would go.
    console.log(
      `Simulating sending email to ${input.email} with message: ${input.message}`
    );
  }
);
