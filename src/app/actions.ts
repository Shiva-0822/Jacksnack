
"use server";

import { z } from "zod";
import { addDoc, collection } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase"; 
import { contactFormAutoResponse } from "@/ai/flows/contact-form-auto-response";
import type { OrderNotificationInput } from "@/lib/types";
import { sendOrderNotificationEmail } from "@/services/email";


// --- Existing Contact Form Action ---
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

// --- Existing Order Action ---
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

// This is the data structure we expect from the client-side form
const ClientOrderDataSchema = z.object({
    amount: z.number(),
    paymentMethod: z.string(),
    paymentStatus: z.string(),
    paymentId: z.string().optional().nullable(),
    items: z.array(z.object({
        id: z.string(),
        name: z.string(),
        quantity: z.number(),
        price: z.number()
    })),
});


export async function createOrderAction(
    orderData: z.infer<typeof ClientOrderDataSchema>, 
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
        
        // This is the full, final object we'll save to Firestore and send in the email
        const finalOrderPayload: OrderNotificationInput = {
            ...orderData,
            customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            address: fullAddress,
            phone: shippingInfo.phone,
            createdAt: new Date(),
        };

        await addDoc(collection(db, "orders"), finalOrderPayload);
        console.log("Order successfully saved to Firestore.");

        // Pass the full, correct payload to the email function
        await sendOrderNotificationEmail(finalOrderPayload);

        return { success: true, message: "Order placed and notification sent." };
    } catch (error: any) {
        console.error("Error in createOrderAction:", error);

        if (error.code === 'permission-denied') {
            return { 
                success: false, 
                error: "Permission Denied: Your security rules are blocking order creation. Please check and deploy your firestore.rules." 
            };
        }
        return { success: false, error: "An unexpected error occurred while placing the order." };
    }
}
