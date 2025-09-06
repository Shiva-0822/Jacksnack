
"use client";

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Truck, Info, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import Header from '@/components/checkout/Header';
import Footer from '@/components/checkout/Footer';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createOrderAction } from '@/app/actions';

const FormSchema = z.object({
    country: z.string(),
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    address: z.string().min(1, "Address is required."),
    apartment: z.string().optional(),
    city: z.string().min(1, "City is required."),
    state: z.string(),
    zip: z.string().min(1, "PIN code is required."),
    phone: z.string().min(1, "Phone number is required."),
});

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutComponent = () => {
  const router = useRouter();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      country: "india",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "karnataka",
      zip: "",
      phone: "",
    },
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  useEffect(() => {
    if (!cartLoading && cart.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Redirecting to products page.",
      });
      router.push('/buy');
    }
  }, [cart, cartLoading, router, toast]);


  const subtotal = useMemo(() => {
    if (!cart) return 0;
    return cart.reduce((acc, item) => {
        if (item.id === 'prod_1') return acc + 1.00;
        return acc + (item.price * item.quantity);
    }, 0);
  }, [cart]);

  const shipping = useMemo(() => {
    if (!cart) return 0;
    const hasJacksnackAlpha = cart.some(item => item.id === 'prod_1');
    return hasJacksnackAlpha ? 1.00 : 40.00;
  }, [cart]);

  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);


  async function handleFinalizeOrder(shippingData: z.infer<typeof FormSchema>, paymentId?: string) {
    if (cart.length === 0) return;
    setIsProcessing(true);

    const orderData = {
        amount: total,
        paymentMethod: paymentMethod,
        paymentStatus: paymentId ? 'paid' : 'cod',
        paymentId: paymentId,
        items: cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        customerName: `${shippingData.firstName} ${shippingData.lastName}`,
        phone: shippingData.phone,
        address: [shippingData.address, shippingData.apartment, shippingData.city, shippingData.state, shippingData.zip, shippingData.country].filter(Boolean).join(', '),
    };

    const result = await createOrderAction(orderData, shippingData);
    
    if (result.success) {
        toast({
            title: paymentId ? 'Payment Successful!' : 'Order Placed!',
            description: "Your order has been placed successfully.",
        });
        await clearCart();
        form.reset();
        router.push('/buy?order_success=true');
    } else {
        toast({
            title: "Error Placing Order",
            description: result.error || "An unexpected error occurred.",
            variant: "destructive",
        });
    }
    setIsProcessing(false);
  }

  async function handlePayNow(data: z.infer<typeof FormSchema>) {
    if (cart.length === 0) return;
    setIsProcessing(true);

    if (paymentMethod === 'cod') {
        await handleFinalizeOrder(data);
    } else {
        if (!window.Razorpay) {
            toast({
                title: "Payment Gateway Error",
                description: "Razorpay is not loaded. Please try again in a moment.",
                variant: "destructive",
            });
            setIsProcessing(false);
            return;
        }

        const productDescription = cart.map(p => p.name).join(', ');

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: total * 100, // amount in the smallest currency unit
            currency: 'INR',
            name: 'JACKSNACK',
            description: `Order for ${productDescription}`,
            image: 'https://picsum.photos/100/50?random=20',
            handler: async (response: any) => {
                await handleFinalizeOrder(data, response.razorpay_payment_id);
            },
            prefill: {
                name: `${data.firstName} ${data.lastName}`,
                contact: data.phone,
            },
            notes: {
                address: [data.address, data.apartment, data.city, data.state, data.zip, data.country].filter(Boolean).join(', '),
            },
            theme: {
                color: '#0c63e4',
            },
            modal: {
                ondismiss: () => {
                    console.log('Payment modal dismissed');
                    setIsProcessing(false);
                    toast({
                        title: 'Payment Canceled',
                        description: 'You canceled the payment process.',
                        variant: 'destructive'
                    });
                },
            },
        };
        const rzpInstance = new window.Razorpay(options);
        rzpInstance.open();
    }
  }


  if (cartLoading || cart.length === 0) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center gap-4">
                <ShoppingCart className="h-16 w-16 text-gray-400 animate-bounce" />
                <p className="text-lg text-gray-600">Loading your cart...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 md:px-6 py-8">
            <div className="mb-6">
                <Link href="/buy" className="flex items-center text-gray-600 hover:text-gray-900 font-medium">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                </Link>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handlePayNow)} className="flex flex-col-reverse lg:flex-row gap-12">
                    
                    {/* Left side: Contact, Delivery, Payment */}
                    <div className="w-full lg:w-2/3 space-y-8">
                        
                        {/* Shipping details Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center mb-4">
                                <Truck className="mr-3 h-6 w-6 text-gray-800" />
                                <h2 className="text-2xl font-semibold text-gray-800">Shipping details</h2>
                            </div>
                            <Separator className="mb-6"/>
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-700">Delivery to</h3>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger><SelectValue placeholder="Country/Region" /></SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="india">India</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="firstName" render={({ field }) => ( <FormItem><FormControl><Input placeholder="First name" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                        <FormField control={form.control} name="lastName" render={({ field }) => ( <FormItem><FormControl><Input placeholder="Last name" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                    </div>

                                    <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormControl><Input placeholder="Address" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                    <FormField control={form.control} name="apartment" render={({ field }) => ( <FormItem><FormControl><Input placeholder="Apartment, suite, etc. (optional)" {...field} /></FormControl></FormItem> )} />

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <FormField control={form.control} name="city" render={({ field }) => ( <FormItem><FormControl><Input placeholder="City" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                        <FormField control={form.control} name="state" render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="karnataka">Karnataka</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="zip" render={({ field }) => ( <FormItem><FormControl><Input placeholder="PIN code" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                    </div>
                                    
                                    <FormField control={form.control} name="phone" render={({ field }) => (
                                        <FormItem>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input placeholder="Phone" className="pr-10" {...field} />
                                                </FormControl>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                                                    <Info className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>
                        </div>
                        
                        {/* Payment Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment</h2>
                             <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                                <div className="border rounded-md has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center space-x-4">
                                            <RadioGroupItem value="razorpay" id="razorpay" />
                                            <Label htmlFor="razorpay" className="font-medium cursor-pointer">Razorpay (UPI, Cards, etc)</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 283.5 283.5" xmlSpace="preserve"><path d="M243.2 119.5c-1-2.6-3.4-4.2-6.1-4.2H127.8l63.4-62.1c2-2-2-5.1 0-7.1l-14.2-14.2c-2-2-5.1-2-7.1 0L64.4 137.5c-2 2-2 5.1 0 7.1l105.5 103.4c2 2 5.1 2 7.1 0l14.2-14.2c2-2 2-5.1 0-7.1l-63.4-62.1h110.1c2.6 0 5.1-1.6 6.1-4.2l3.4-8.8c1.2-2.8.2-6.1-2.4-7.1z" fill="#008cff" /></svg>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-6 text-center text-gray-600 border-t">
                                        <div className="flex justify-center items-center flex-col space-y-4">
                                            <ShieldCheck className="h-10 w-10 text-green-500" />
                                            <p className="text-xs max-w-xs mx-auto">After clicking “Pay now”, you will be redirected to Razorpay to complete your purchase securely.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 border rounded-md has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                                    <RadioGroupItem value="cod" id="cod" />
                                    <Label htmlFor="cod" className="ml-3 font-medium cursor-pointer flex items-center">
                                        <Truck className="mr-2 h-5 w-5" />
                                        Cash on Delivery (COD)
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        
                         <Button size="lg" type="submit" className="w-full text-lg bg-[#0c63e4] hover:bg-[#0b5ed7] text-white font-semibold" disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : 'Pay now'}
                        </Button>
                    </div>

                    {/* Right side: Order Summary */}
                    <aside className="w-full lg:w-1/3">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="space-y-6">
                                {cart.map(item => (
                                <div key={item.id} className="flex items-center space-x-6">
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                                        <Image 
                                            src={item.imageURL} 
                                            alt={item.name} 
                                            width={96}
                                            height={96}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                                        <p className="text-xl font-bold text-gray-900 mt-2">₹{item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                ))}
                            </div>
                            <Separator className="my-6" />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-gray-800">₹{shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                </form>
            </Form>
        </main>
        <Footer />
    </div>
  );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutComponent />
        </Suspense>
    )
}

    