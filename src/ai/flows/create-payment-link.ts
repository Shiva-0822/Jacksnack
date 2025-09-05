'use server';
/**
 * @fileOverview A Genkit flow for creating a Razorpay payment link.
 *
 * - createPaymentLink - A function that creates a Razorpay payment link.
 * - CreatePaymentLinkInput - The input type for the createPaymentLink function.
 * - CreatePaymentLinkOutput - The return type for the createPaymentLink function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import Razorpay from 'razorpay';

const CreatePaymentLinkInputSchema = z.object({
  amount: z.number().describe('The amount for the payment link in the smallest currency unit (e.g., paise for INR).'),
  customer: z.object({
    name: z.string().describe('The name of the customer.'),
    contact: z.string().describe('The contact number of the customer.'),
  }),
  description: z.string().describe('A description for the payment link.'),
});
export type CreatePaymentLinkInput = z.infer<typeof CreatePaymentLinkInputSchema>;

const CreatePaymentLinkOutputSchema = z.object({
  paymentLink: z.string().url().describe('The short URL of the generated Razorpay payment link.'),
});
export type CreatePaymentLinkOutput = z.infer<typeof CreatePaymentLinkOutputSchema>;

// This function will be called from the client-side
export async function createPaymentLink(input: CreatePaymentLinkInput): Promise<CreatePaymentLinkOutput> {
  return createPaymentLinkFlow(input);
}

const createPaymentLinkFlow = ai.defineFlow(
  {
    name: 'createPaymentLinkFlow',
    inputSchema: CreatePaymentLinkInputSchema,
    outputSchema: CreatePaymentLinkOutputSchema,
  },
  async (input) => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay API keys are not configured in environment variables.');
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    const options = {
        amount: input.amount,
        currency: "INR",
        accept_partial: false,
        description: input.description,
        customer: {
            name: input.customer.name,
            contact: input.customer.contact
        },
        notify: {
            sms: true,
            email: false
        },
        reminder_enable: true,
        callback_url: "https://jacksnack.in/buy",
        callback_method: "get" as const
    };

    try {
        const paymentLink = await instance.paymentLink.create(options);
        return {
            paymentLink: paymentLink.short_url,
        };
    } catch(error) {
        console.error("Razorpay API Error:", error);
        throw new Error("Failed to create Razorpay payment link.");
    }
  }
);
