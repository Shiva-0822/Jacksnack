/**
 * @fileOverview A service for sending emails using the Resend API.
 * 
 * - sendEmail - A function to send an email.
 */

'use server';

import { Resend } from 'resend';

// Ensure the RESEND_API_KEY is available in the environment variables.
if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set. Email notifications will not be sent.");
}

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using the Resend service.
 * @param options - The email options including to, subject, and html content.
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!process.env.RESEND_API_KEY || !fromEmail) {
    console.error("Resend is not configured. Cannot send email.");
    // In a real app, you might want to throw an error or handle this more gracefully.
    return;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`Email sent to ${options.to} with subject "${options.subject}"`);
  } catch (error) {
    console.error('Error sending email:', error);
    // Depending on requirements, you might want to re-throw the error
    // so the calling flow can handle it.
    throw new Error('Failed to send email.');
  }
}
