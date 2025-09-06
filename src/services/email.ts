
'use server';

import { Resend } from 'resend';
import type { OrderNotificationInput } from '@/lib/types';

// Ensure the RESEND_API_KEY is available in the environment variables.
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in the environment variables.');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderNotificationEmail(order: OrderNotificationInput) {
  const fromEmail = process.env.FROM_EMAIL;
  const toEmail = process.env.OWNER_EMAIL;

  if (!fromEmail || !toEmail) {
    console.error('FROM_EMAIL or OWNER_EMAIL is not set in environment variables.');
    throw new Error('Email configuration is missing.');
  }

  const subject = `New Order Received - ${order.productName || 'Multiple Items'}`;
  
  const itemsHtml = order.items 
    ? order.items.map(item => `<li>${item.name} (x${item.quantity}) - ₹${item.price.toFixed(2)}</li>`).join('')
    : `<li>${order.productName} (x${order.quantity})</li>`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h1 style="color: #333;">🛍️ New Order Received!</h1>
      <p>A new order has been placed on your website.</p>
      <hr>
      <h2>Order Details:</h2>
      <ul>
        <li><strong>Customer Name:</strong> ${order.customerName}</li>
        <li><strong>Phone:</strong> ${order.phone}</li>
        <li><strong>Address:</strong> ${order.address}</li>
      </ul>
      <h2>Product(s):</h2>
      <ul>
        ${itemsHtml}
      </ul>
      <hr>
      <h2>Payment Details:</h2>
      <ul>
        <li><strong>Total Amount:</strong> ₹${order.amount.toFixed(2)}</li>
        <li><strong>Payment Method:</strong> ${order.paymentMethod}</li>
        <li><strong>Payment Status:</strong> ${order.paymentStatus}</li>
        ${order.paymentId ? `<li><strong>Payment ID:</strong> ${order.paymentId}</li>` : ''}
      </ul>
      <p>Please process this order as soon as possible.</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });
    console.log(`Order notification email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error('Error sending order notification email:', error);
    // We don't re-throw the error to not block the user-facing flow.
    // The order is saved, only the notification failed.
  }
}
