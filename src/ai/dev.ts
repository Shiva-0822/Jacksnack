import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-product-feedback.ts';
import '@/ai/flows/contact-form-auto-response.ts';
import '@/ai/flows/send-order-notification-email.ts';
