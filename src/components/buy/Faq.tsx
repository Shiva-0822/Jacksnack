
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
    {
        question: "What is JackSnack?",
        answer: "JackSnack is a premium brand of vacuum-fried fruit and vegetable chips made in Sringeri, Karnataka. We specialize in producing healthy snacks that are crunchy, tasty, and guilt-free—perfect for the health-conscious consumer. Unlike traditional deep-fried chips, our snacks are made using vacuum frying technology, which preserves the natural flavor, color, and nutrients of fresh produce while using up to 80% less oil. We use rice bran oil, not palm oil, and our products contain no added preservatives, no added sugar, no gluten, and no artificial colors."
    },
    { question: "Is JackSnack healthy?", answer: "Yes, our snacks are a healthier alternative to traditional deep-fried chips." },
    { question: "Is JackSnack Organic?", answer: "Our products are made from natural ingredients, but we are not yet certified organic." },
    { question: "Do we use oil in vacuum frying?", answer: "Yes, but up to 80% less oil is absorbed compared to traditional frying." },
    { question: "Which oil will be used in vacuum frying?", answer: "We use high-quality rice bran oil." },
    { question: "Why are the prices so High?", answer: "Our prices reflect the premium ingredients and specialized technology used to create a healthier, higher-quality snack." },
    { question: "What is the product range offered by JackSnack?", answer: "We offer a wide range of fruit and vegetable chips, including jackfruit, bhindi (okra), garlic, and more." },
    { question: "Where is JackSnack located?", answer: "Our company is located in Sringeri, Karnataka, India." },
    { question: "Why is JackSnack mostly named in Media?", answer: "Our innovative and healthy products have garnered significant media attention." },
    { question: "How we can order JackSnack?", answer: "You can order directly from our website on the Products page." },
    { question: "Is JackSnack delivers Pan India?", answer: "Yes, we deliver our products all across India." },
];

export default function Faq() {
  return (
    <section id="faq" className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-xs sm:max-w-sm mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">What is JackSnack?</h3>
                <p className="text-gray-600 text-sm">
                    JackSnack is a premium brand of vacuum-fried fruit and vegetable chips made in Sringeri, Karnataka. We specialize in producing healthy snacks that are crunchy, tasty, and guilt-free—perfect for the health-conscious consumer. Unlike traditional deep-fried chips, our snacks are made using vacuum frying technology, which preserves the natural flavor, color, and nutrients of fresh produce while using up to 80% less oil. We use rice bran oil, not palm oil, and our products contain no added preservatives, no added sugar, no gluten, and no artificial colors.
                </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
                {faqData.slice(1).map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-green-600 border-b-2 border-white rounded-md mb-1 text-white">
                        <AccordionTrigger className="px-6 py-2 text-sm font-medium hover:no-underline hover:bg-green-700 rounded-t-md">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 py-4 bg-white text-gray-700 rounded-b-md text-sm">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </div>
    </section>
  );
}
