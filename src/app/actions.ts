"use server";

import { z } from "zod";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { contactFormAutoResponse } from "@/ai/flows/contact-form-auto-response";

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
    await addDoc(collection(db, "messages"), {
      ...validatedFields.data,
      submittedAt: new Date(),
    });

    await contactFormAutoResponse(validatedFields.data);

    return { success: true };
  } catch (error) {
    console.error("Error saving message to Firestore:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
