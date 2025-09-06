
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
  
  let itemsHtml: string;

  if (order.items && order.items.length > 0) {
    itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
      </tr>
    `).join('');
  } else if (order.productName) {
    // For single item orders, we need to calculate the price per item if not available directly
    const price = (order.amount - 40) / (order.quantity || 1) ; // Assuming 40 is shipping
     itemsHtml = `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${order.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${price.toFixed(2)}</td>
      </tr>
    `;
  } else {
    itemsHtml = '<tr><td colspan="3" style="padding: 8px; border-bottom: 1px solid #ddd;">No items details available.</td></tr>';
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
      <h1 style="color: #000; font-size: 24px; text-align: center;">🛍️ New Order Received!</h1>
      <p style="text-align: center;">A new order has been placed on your website.</p>
      
      <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0;">Customer Details</h2>
        <p><strong>Name:</strong> ${order.customerName}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Address:</strong> ${order.address}</p>
      </div>
      
      <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0;">Order Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Product</th>
                    <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: center;">Quantity</th>
                    <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: right;">Price</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
        </table>
      </div>

      <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0;">Payment Details</h2>
        <p><strong>Total Amount:</strong> ₹${order.amount.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
        ${order.paymentId ? `<p><strong>Payment ID:</strong> ${order.paymentId}</p>` : ''}
      </div>

      <p style="text-align: center; margin-top: 20px; color: #888;">Please process this order as soon as possible.</p>
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
