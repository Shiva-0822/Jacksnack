
"use server";

import { z } from "zod";
import { addDoc, collection } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase"; 
import { contactFormAutoResponse } from "@/ai/flows/contact-form-auto-response";
import type { OrderNotificationInput } from "@/lib/types";
import { sendOrderNotificationEmail } from "@/services/email";

const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function submitContactForm(data: z.infer<typeof ContactFormSchema>) {
  const validatedFields = ContactFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid data provided.",
    };
  }

  try {
    // In a real app, you would use the Firebase Admin SDK to interact with Firestore from the server.
    // This is a simulation since we are in a client-only environment for this part.
    console.log("Simulating saving message to Firestore:", validatedFields.data);

    await contactFormAutoResponse(validatedFields.data);

    return { success: true };
  } catch (error) {
    console.error("Error processing contact form:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Schema for data coming from the checkout form
const ShippingInfoSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(1),
    apartment: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().min(1),
});

// This is the main server action that will handle order creation
export async function createOrderAction(
    orderData: OrderNotificationInput, 
    shippingInfo: z.infer<typeof ShippingInfoSchema>
) {
    try {
        const db = getFirebaseDb();

        const fullAddress = [
            shippingInfo.address, 
            shippingInfo.apartment, 
            shippingInfo.city, 
            shippingInfo.state, 
            shippingInfo.zip, 
            shippingInfo.country
        ].filter(Boolean).join(', ');
        
        const finalOrderPayload = {
            ...orderData,
            customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            address: fullAddress,
            phone: shippingInfo.phone,
            createdAt: new Date(),
        };

        // 1. Save the order to Firestore
        await addDoc(collection(db, "orders"), finalOrderPayload);
        console.log("Order successfully saved to Firestore.");

        // 2. Send the email notification
        await sendOrderNotificationEmail(finalOrderPayload);

        return { success: true, message: "Order placed and notification sent." };
    } catch (error: any) {
        console.error("Error in createOrderAction:", error);

        // Check for Firestore permission errors specifically
        if (error.code === 'permission-denied') {
            return { 
                success: false, 
                error: "Permission Denied: Your security rules are blocking order creation. Please deploy your firestore.rules." 
            };
        }

        // To avoid leaking internal errors, we return a generic message for other errors.
        return { success: false, error: "An unexpected error occurred while placing the order." };
    }
}
