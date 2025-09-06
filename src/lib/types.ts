
import { z } from 'zod';

export interface Product {
  id: string;
  name: string;
  imageURL: string;
  quantity: number;
  price: number;
  description?: string;
}

export interface Testimonial {
  id: string;
  name:string;
  role: string;
  review: string;
  imageURL: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageURL: string;
}

export const OrderNotificationInputSchema = z.object({
  customerName: z.string(),
  phone: z.string(),
  address: z.string(),
  amount: z.number(),
  paymentMethod: z.string(),
  paymentStatus: z.string(),
  paymentId: z.string().optional(),
  // For single product checkout
  productName: z.string().optional(),
  quantity: z.number().optional(),
  // For multi-product checkout
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
  })).optional(),
});

export type OrderNotificationInput = z.infer<typeof OrderNotificationInputSchema>;
