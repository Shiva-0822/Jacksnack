
"use client";

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Truck, Info, ShieldCheck, PartyPopper } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';


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

const DeliveryPageComponent = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = params;
  const [product, setProduct] = useState<(CheckoutProduct & { id: string }) | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('phonepe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
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
    if (id) {
      const foundProduct = MOCK_PRODUCTS.find(p => p.id === id);
      if (foundProduct) {
        setTimeout(() => {
          setProduct(foundProduct);
        }, 500);
      }
    }
    const qty = searchParams.get('quantity');
    if (qty && !isNaN(parseInt(qty))) {
      setQuantity(parseInt(qty));
    }
  }, [id, searchParams]);

  useEffect(() => {
    if (orderConfirmed) {
      window.scrollTo(0, 0);
    }
  }, [orderConfirmed]);

  const subtotal = useMemo(() => {
      if (!product) return 0;
      return product.price * quantity;
  }, [product, quantity]);

  const shipping = 40.00;
  
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);


  async function handleFinalizeOrder(shippingData: z.infer<typeof FormSchema>, paymentId?: string) {
    if (!product) return;
    setIsProcessing(true);

    const orderData = {
        amount: total,
        paymentMethod: paymentMethod,
        paymentStatus: paymentId ? 'paid' : (paymentMethod === 'cod' ? 'cod' : 'pending'),
        paymentId: paymentId,
        items: [{
            id: product.id,
            name: product.name,
            quantity: quantity,
            price: product.price
        }]
    };

    const result = await createOrderAction(orderData, shippingData);

    if (result.success) {
        toast({
            title: paymentMethod === 'cod' ? 'Order Confirmed!' : 'Payment Successful!',
            description: `Your order for ${product.name} has been placed.`,
        });
        form.reset();
        setOrderConfirmed(true);
    } else {
        toast({
            title: "Error Placing Order",
            description: result.error || "An unexpected error occurred.",
            variant: "destructive",
        });
    }
    setIsProcessing(false);
  }

  async function handleSubmit(data: z.infer<typeof FormSchema>) {
    if (!product) return;
    
    setIsProcessing(true);
    await handleFinalizeOrder(data);
  }

  if (orderConfirmed) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main className="container mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center text-center">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <PartyPopper className="h-20 w-20 text-green-500 mx-auto mb-6 animate-pulse" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 mb-8">Thank you for your purchase. We've received your order and will process it shortly.</p>
                <Link href="/deliverypage">
                    <Button>Continue Shopping</Button>
                </Link>
            </div>
        </main>
        <Footer />
    </div>
    )
  }

  if (!product) {
    return (
        <div className="bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 md:px-6 py-8">
                <div className="mb-6">
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex flex-col lg:flex-row gap-12">
                    <aside className="w-full lg:w-2/5 lg:order-2">
                        <Skeleton className="h-8 w-48 mb-6" />
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-6">
                                <Skeleton className="w-24 h-24 rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-8 w-24 mt-2" />
                                </div>
                            </div>
                            <Separator className="my-6" />
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-6 w-28" />
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="w-full lg:w-3/5 lg:order-1 space-y-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <Skeleton className="h-8 w-64 mb-6" />
                            <Separator className="mb-6"/>
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <Skeleton className="h-8 w-40 mb-4" />
                            <div className="space-y-4">
                                <Skeleton className="h-24 w-full rounded-md" />
                                <Skeleton className="h-12 w-full rounded-md" />
                            </div>
                        </div>
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 md:px-6 py-8">
            <div className="mb-6">
                <Link href="/deliverypage" className="flex items-center text-gray-600 hover:text-gray-900 font-medium">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                </Link>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col lg:flex-row gap-12">
                    <aside className="w-full lg:w-2/5 lg:order-2">
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

                    <div className="w-full lg:w-3/5 lg:order-1 space-y-8">
                        
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
                        
                        <div className="bg-white rounded-lg shadow-md p-6">
                             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment</h2>
                             <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                                <div className="border rounded-md has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center space-x-4">
                                            <RadioGroupItem value="phonepe" id="phonepe" />
                                             <Label htmlFor="phonepe" className="font-medium cursor-pointer flex items-center gap-2">
                                                PhonePe
                                                <svg height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M68.7 75.2c-4.2-2-6-4.5-8.2-7.5-2.5-3.3-5-6.7-5.2-11.4-.4-7.8 4.7-11.4 6-13.3.6-1 1.7-2.6 1.7-4.4 0-2.3-1.6-4.5-4-4.5-2.5 0-4.3 1-5.8 1.6-3.2 1.3-6.2 3.8-10.4 3.8-4.2 0-7-2-8.5-3.8-1.7-1-3.5-1.5-6-1.5-2.5 0-4.3 1.3-4.3 4.6 0 1.8 1 3.4 1.6 4.3 1.2 2 6 6.2 6.3 13.2.2 4.8-2.3 8.2-5 11.5-2.2 3-4 5.5-8.2 7.5-4.2 2-6.5 4.3-6.5 7.8 0 4.2 3.8 8.8 11.2 8.8h46.3C80.2 91.8 84 87.2 84 83c0-3.5-2.3-5.8-6.6-7.8h-8.7zM50 2.5C23.8 2.5 2.5 23.8 2.5 50S23.8 97.5 50 97.5 97.5 76.2 97.5 50 76.2 2.5 50 2.5zm.2 17.2c11.2 0 15.5 10.8 15.5 10.8s-4.3 4.2-15.5 4.2-15.5-4.2-15.5-4.2S39 19.7 50.2 19.7z" fill="#5f259f"/></svg>
                                            </Label>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-6 text-center text-gray-600 border-t">
                                        <div className="flex justify-center items-center flex-col space-y-4">
                                            <ShieldCheck className="h-10 w-10 text-green-500" />
                                            <p className="text-xs max-w-xs mx-auto">After clicking “Pay now”, you will be redirected to PhonePe to complete your purchase securely.</p>
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
                        
                         <Button type="submit" className="w-full bg-[#0c63e4] hover:bg-[#0b5ed7] text-white font-semibold" disabled={isProcessing}>
                           {isProcessing ? 'Processing...' : (paymentMethod === 'cod' ? 'Confirm Order!' : 'Pay now & Confirm Order!')}
                        </Button>
                    </div>
                </form>
            </Form>
        </main>
        <Footer />
    </div>
  );
}

export default function DeliveryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DeliveryPageComponent />
        </Suspense>
    )
}
