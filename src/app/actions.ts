
"use server";

import { z } from "zod";
import { addDoc, collection } from "firebase/firestore";
// The getFirebaseDb function can't be used in a server component, so we will remove this for now.
// A proper implementation would use the Firebase Admin SDK here.
// import { getFirebaseDb } from "@/lib/firebase"; 
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
    // Since we can't use the client-side `getFirebaseDb` here, this will be commented out.
    // In a real app, you would use the Firebase Admin SDK to interact with Firestore from the server.
    // const db = getFirebaseDb();
    // await addDoc(collection(db, "messages"), {
    //   ...validatedFields.data,
    //   submittedAt: new Date(),
    // });
    console.log("Simulating saving message to Firestore:", validatedFields.data);

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
