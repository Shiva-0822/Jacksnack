/**
 * @fileOverview A Genkit flow for sending a new order notification email to the shop owner.
 *
 * - sendOrderNotificationEmail - A function that constructs and sends the order email.
 * - OrderNotificationInput - The input type for the sendOrderNotificationEmail function.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { sendEmail } from '@/services/email';
import { OrderNotificationInputSchema, type OrderNotificationInput } from '@/lib/types';

export { type OrderNotificationInput };

export async function sendOrderNotificationEmail(input: OrderNotificationInput): Promise<void> {
  await sendOrderNotificationEmailFlow(input);
}

const sendOrderNotificationEmailFlow = ai.defineFlow(
  {
    name: 'sendOrderNotificationEmailFlow',
    inputSchema: OrderNotificationInputSchema,
    outputSchema: z.void(),
  },
  async (order) => {
    const ownerEmail = process.env.OWNER_EMAIL;

    if (!ownerEmail) {
      console.error("OWNER_EMAIL is not set. Cannot send order notification.");
      return;
    }

    const subject = `🛍️ New Order Received: ${order.items.map(item => item.name).join(', ')}`;

    // Simple but clean HTML email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #333;">🛍️ New Order Notification</h1>
        <p>You've received a new order. Here are the details:</p>
        
        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details</h2>
        <ul>
          <li><strong>Name:</strong> ${order.customerName}</li>
          <li><strong>Phone:</strong> ${order.phone}</li>
          <li><strong>Address:</strong> ${order.address}</li>
        </ul>

        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Order Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">₹${item.price.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Payment Details</h2>
        <ul>
          <li><strong>Total Amount:</strong> ₹${order.amount.toFixed(2)}</li>
          <li><strong>Payment Method:</strong> ${order.paymentMethod}</li>
          <li><strong>Payment Status:</strong> ${order.paymentStatus}</li>
          ${order.paymentId ? `<li><strong>Payment ID:</strong> ${order.paymentId}</li>` : ''}
        </ul>
        
        <p style="margin-top: 20px; font-size: 0.9em; color: #777;">This is an automated notification from your Jacksnack online store.</p>
      </div>
    `;

    await sendEmail({
      to: ownerEmail,
      subject: subject,
      html: htmlContent,
    });
  }
);
