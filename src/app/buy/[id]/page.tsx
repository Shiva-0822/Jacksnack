
"use client";

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Truck, Info, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/lib/types';
import Header from '@/components/buy/Header';
import Footer from '@/components/buy/Footer';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createOrderAction } from '@/app/actions';

const MOCK_PRODUCTS: (Omit<Product, 'quantity'> & { price: number; reviews: number; rating: number; dataAiHint: string })[] = [
    {
      id: 'prod_1',
      name: 'Jacksnack Alpha',
      imageURL: 'https://picsum.photos/400/600?random=1',
      price: 1.00,
      reviews: 120,
      rating: 5,
      dataAiHint: 'sleek gadget'
    },
    {
      id: 'prod_2',
      name: 'Vacuum Fried Bhindi Treat Mini - 20 gms',
      imageURL: 'https://picsum.photos/300/300?random=22',
      price: 55.00,
      reviews: 12,
      rating: 4,
      dataAiHint: 'fried okra snack',
    },
    {
      id: 'prod_3',
      name: 'Vacuum Fried Jackfruit Treat - 50 gms',
      imageURL: 'https://picsum.photos/300/300?random=23',
      price: 99.00,
      reviews: 16,
      rating: 5,
      dataAiHint: 'jackfruit chips',
    },
    {
      id: 'prod_4',
      name: 'Vacuum Fried Garlic Treat - 40 gms',
      imageURL: 'https://picsum.photos/300/300?random=24',
      price: 130.00,
      reviews: 19,
      rating: 5,
      dataAiHint: 'garlic chips',
    },
    {
      id: 'prod_5',
      name: 'Chips',
      imageURL: 'https://picsum.photos/400/400?random=25',
      price: 50.00,
      reviews: 25,
      rating: 4,
      dataAiHint: 'potato chips',
    },
    {
      id: 'prod_6',
      name: 'Spicy Sticks',
      imageURL: 'https://picsum.photos/400/400?random=26',
      price: 60.00,
      reviews: 18,
      rating: 5,
      dataAiHint: 'spicy snacks',
    },
    {
      id: 'prod_7',
      name: 'Jacksnack Beta',
      imageURL: 'https://picsum.photos/400/600?random=2',
      price: 79.99,
      reviews: 95,
      rating: 4,
      dataAiHint: 'modern device'
    },
    {
      id: 'prod_8',
      name: 'Jacksnack Gamma',
      imageURL: 'https://picsum.photos/400/600?random=3',
      price: 129.99,
      reviews: 210,
      rating: 5,
      dataAiHint: 'premium electronics'
    },
  ];

type CheckoutProduct = Omit<Product, 'quantity'> & { price: number };

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
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = params;
  const [product, setProduct] = useState<(CheckoutProduct & { id: string }) | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [rzp, setRzp] = useState<any>(null);

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
    script.onload = () => {
        // The Razorpay object is now available on the window
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (id) {
      const foundProduct = MOCK_PRODUCTS.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
    const qty = searchParams.get('quantity');
    if (qty && !isNaN(parseInt(qty))) {
      setQuantity(parseInt(qty));
    }
  }, [id, searchParams]);

  const subtotal = useMemo(() => {
      if (!product) return 0;
      return product.id === 'prod_1' ? 1.00 : product.price * quantity;
  }, [product, quantity]);

  const shipping = useMemo(() => {
      if (!product) return 0;
      return product.id === 'prod_1' ? 1.00 : 40.00;
  }, [product]);
  
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);


  async function handleFinalizeOrder(shippingData: z.infer<typeof FormSchema>, paymentId?: string) {
    if (!product) return;

    const orderData = {
        amount: total,
        paymentMethod: paymentMethod,
        paymentStatus: paymentId ? 'paid' : 'cod',
        paymentId: paymentId,
        productName: product.name,
        quantity: quantity,
        customerName: `${shippingData.firstName} ${shippingData.lastName}`,
        phone: shippingData.phone,
        address: [shippingData.address, shippingData.apartment, shippingData.city, shippingData.state, shippingData.zip, shippingData.country].filter(Boolean).join(', '),
    };

    const result = await createOrderAction(orderData, shippingData);

    if (result.success) {
        toast({
            title: paymentId ? 'Payment Successful!' : 'Order Placed!',
            description: `Your order for ${product.name} has been placed.`,
        });
        form.reset();
        router.push(`/buy?order_success=true`);
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
    if (!product) return;
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

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: total * 100, // amount in the smallest currency unit
            currency: 'INR',
            name: 'JACKSNACK',
            description: `Order for ${product.name}`,
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

  if (!product) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Product not found or loading...</p>
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
                <form onSubmit={form.handleSubmit(handlePayNow)} className="flex flex-col lg:flex-row gap-12">
                    {/* Left side: Order Summary */}
                    <aside className="w-full lg:w-1/3 lg:order-2">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-6">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                                    <Image 
                                        src={product.imageURL} 
                                        alt={product.name} 
                                        width={96}
                                        height={96}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                                    <p className="text-gray-600">Quantity: {quantity}</p>
                                    <p className="text-xl font-bold text-gray-900 mt-2">₹{product.price.toFixed(2)}</p>
                                </div>
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

                    {/* Right side: Contact, Delivery, Payment */}
                    <div className="w-full lg:w-2/3 lg:order-1 space-y-8">
                        
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
