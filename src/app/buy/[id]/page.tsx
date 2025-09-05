
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Landmark, Truck, Info, ChevronDown, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/lib/types';
import Header from '@/components/buy/Header';
import Footer from '@/components/buy/Footer';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { addDoc, collection, Firestore } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { FirebaseError } from 'firebase/app';

const MOCK_PRODUCTS: (Omit<Product, 'quantity'> & { price: number; reviews: number; rating: number; dataAiHint: string })[] = [
    {
      id: '1',
      name: 'Jacksnack Alpha',
      imageURL: 'https://picsum.photos/400/600?random=1',
      price: 1.00,
      reviews: 120,
      rating: 5,
      dataAiHint: 'sleek gadget'
    },
    {
      id: '2',
      name: 'Vacuum Fried Bhindi Treat Mini - 20 gms',
      imageURL: 'https://picsum.photos/300/300?random=22',
      price: 55.00,
      reviews: 12,
      rating: 4,
      dataAiHint: 'fried okra snack',
    },
    {
      id: '3',
      name: 'Vacuum Fried Jackfruit Treat - 50 gms',
      imageURL: 'https://picsum.photos/300/300?random=23',
      price: 99.00,
      reviews: 16,
      rating: 5,
      dataAiHint: 'jackfruit chips',
    },
    {
      id: '4',
      name: 'Vacuum Fried Garlic Treat - 40 gms',
      imageURL: 'https://picsum.photos/300/300?random=24',
      price: 130.00,
      reviews: 19,
      rating: 5,
      dataAiHint: 'garlic chips',
    },
    {
      id: '5',
      name: 'Chips',
      imageURL: 'https://picsum.photos/400/400?random=25',
      price: 50.00,
      reviews: 25,
      rating: 4,
      dataAiHint: 'potato chips',
    },
    {
      id: '6',
      name: 'Spicy Sticks',
      imageURL: 'https://picsum.photos/400/400?random=26',
      price: 60.00,
      reviews: 18,
      rating: 5,
      dataAiHint: 'spicy snacks',
    },
    {
      id: '2',
      name: 'Jacksnack Beta',
      imageURL: 'https://picsum.photos/400/600?random=2',
      price: 79.99,
      reviews: 95,
      rating: 4,
      dataAiHint: 'modern device'
    },
    {
      id: '3',
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
  const [db, setDb] = useState<Firestore | null>(null);

  useEffect(() => {
    try {
      setDb(getFirebaseDb());
    } catch(e) {
      console.error(e);
      toast({
        title: "Database Error",
        description: "Could not connect to the database.",
        variant: "destructive",
      });
    }
  }, [toast]);

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

  const sendWhatsAppMessage = (orderData: any) => {
    const ownerNumber = '918123363394';
    const messageParts = [
        `🛍️ *New Order!*`,
        `*Payment:* ${orderData.paymentMethod}`,
        `*Customer:* ${orderData.customerName}`,
        `*Phone:* ${orderData.phone}`,
        `*Product:* ${orderData.productName}`,
        `*Quantity:* ${orderData.quantity}`,
        `*Address:* ${orderData.address}`,
        `*Total Amount:* ₹${orderData.amount.toFixed(2)}`
    ];
    const message = messageParts.join('\n');
    const whatsappUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const makePayment = async (orderData: any) => {
    if (!db) {
        toast({
            title: "Database not available",
            description: "Please try again later.",
            variant: "destructive",
        });
        setIsProcessing(false);
        return;
    }
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      name: 'JACKSNACK',
      description: `Order for ${orderData.productName}`,
      image: 'https://picsum.photos/100/50?random=20',
      handler: async (response: any) => {
        try {
            console.log('Payment successful:', response);
            
            const finalOrderData = {
              ...orderData,
              paymentId: response.razorpay_payment_id,
              paymentStatus: 'paid',
            }
            await addDoc(collection(db, "orders"), finalOrderData);

            sendWhatsAppMessage(finalOrderData);
    
            toast({
              title: 'Payment Successful!',
              description: `Your order for ${orderData.productName} has been placed.`,
            });
            form.reset();
        } catch (error) {
            console.error("Error saving order after payment:", error);
            if (error instanceof FirebaseError && error.code === 'permission-denied') {
                toast({
                    title: "Permission Denied",
                    description: "Action needed: Your app does not have permission to write to the database. Please update your Firestore security rules in the Firebase Console.",
                    variant: "destructive",
                    duration: 9000,
                });
            } else {
                toast({
                    title: "Error",
                    description: "There was a problem saving your order after payment. Please contact support.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsProcessing(false);
        }
      },
      prefill: {
        name: orderData.customerName,
        email: orderData.email,
        contact: orderData.phone,
      },
      notes: {
        address: orderData.address,
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

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  async function handlePayNow(data: z.infer<typeof FormSchema>) {
    if (!product) return;
    
    if (!db) {
        toast({
            title: "Database not available",
            description: "Please try again later.",
            variant: "destructive",
        });
        return;
    }

    setIsProcessing(true);
    
    const subtotal = product.id === '1' ? 1.00 : product.price * quantity;
    const shipping = product.id === '1' ? 1.00 : 40.00;
    const total = subtotal + shipping;

    const orderData = {
        customerName: `${data.firstName} ${data.lastName}`,
        email: 'not-provided@example.com',
        phone: data.phone,
        address: [data.address, data.apartment, data.city, data.state, data.zip, data.country].filter(Boolean).join(', '),
        productName: product.name,
        quantity: quantity,
        amount: total,
        paymentMethod: paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'placed',
        trackingId: '',
        createdAt: new Date(),
    };

    try {
        if (paymentMethod === 'razorpay') {
            await makePayment(orderData);
        } else { // COD
            const finalOrderData = { ...orderData, paymentStatus: 'cod' };
            await addDoc(collection(db, "orders"), finalOrderData);

            sendWhatsAppMessage(finalOrderData);

            toast({
              title: "Order Placed!",
              description: "Your order has been placed successfully. You will pay on delivery.",
            });
            form.reset();
            setIsProcessing(false);
        }

    } catch (error) {
        console.error("Error processing order: ", error);
        if (error instanceof FirebaseError && error.code === 'permission-denied') {
            toast({
                title: "Permission Denied",
                description: "Action needed: Your app does not have permission to write to the database. Please update your Firestore security rules in the Firebase Console.",
                variant: "destructive",
                duration: 9000,
            });
        } else {
             toast({
                title: "Error",
                description: "There was a problem placing your order. Please try again.",
                variant: "destructive",
            });
        }
        setIsProcessing(false);
    }
  }


  if (!product) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Product not found or loading...</p>
        </div>
    );
  }

  const subtotal = product.id === '1' ? 1.00 : product.price * quantity;
  const shipping = product.id === '1' ? 1.00 : 40.00;
  const total = subtotal + shipping;

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
