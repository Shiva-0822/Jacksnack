
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

const MOCK_PRODUCTS: (Omit<Product, 'description'> & { price: number; reviews: number; rating: number; dataAiHint: string })[] = [
    {
      id: '1',
      name: 'Vacuum Fried Bhindi Okra Treat - 50 gms',
      imageURL: 'https://picsum.photos/300/300?random=21',
      price: 130.00,
      reviews: 33,
      rating: 5,
      dataAiHint: 'fried okra',
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
  ];

type CheckoutProduct = Omit<Product, 'description'> & { price: number };

const FormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }),
    country: z.string(),
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    address: z.string().min(1, "Address is required."),
    apartment: z.string().optional(),
    city: z.string().min(1, "City is required."),
    state: z.string(),
    zip: z.string().min(1, "PIN code is required."),
    phone: z.string().min(1, "Phone number is required."),
    saveInfo: z.boolean().optional(),
    emailOffers: z.boolean().optional(),
    textOffers: z.boolean().optional(),
});

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PhonePeLogo = () => <svg width="40" height="20" viewBox="0 0 119 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M99.638 15.01H105.52V27.132H112.553V15.01H118.435V9.458H99.638V15.01Z" fill="#844BD9"/><path d="M85.034 22.84C88.474 22.84 90.738 21.11 90.738 18.064C90.738 15.018 88.474 13.288 85.034 13.288H79.23V22.84H85.034ZM79.23 7.822H84.88C88.948 7.822 91.956 9.63 91.956 13.288V13.794C94.068 14.544 95.736 16.002 95.736 18.292C95.736 22.186 92.426 24.474 88.026 24.474H84.726V27.132H79.23V22.84V7.822Z" fill="#844BD9"/><path d="M60.384 21.032L63.314 27.132H69.096L64.242 18.446L68.868 9.458H63.236L59.722 16.08L56.208 9.458H50.576L55.28 18.368L50.354 27.132H56.136L60.384 21.032Z" fill="#844BD9"/><path d="M47.239 0.814003H35.839V5.038H41.539V27.132H47.239V0.814003Z" fill="#8f4fe8"/><path d="M22.039 12.334C24.439 12.334 26.131 11.026 26.131 8.86C26.131 6.694 24.439 5.386 22.039 5.386H17.915V12.334H22.039ZM17.915 27.132H23.547L29.725 16.908C31.523 19.386 33.865 20.378 36.601 20.378H38.5V27.132H32.88V22.062C30.694 22.062 29.026 21.07 27.796 19.464L23.833 27.132H17.915V12.334V7.822V5.386V0.814003H22.193C25.939 0.814003 29.117 3.024 29.117 6.848C29.117 9.872 26.853 12.042 23.833 12.792V12.87C26.361 13.542 28.159 15.35 28.159 17.83C28.159 19.854 26.929 21.662 25.131 22.84L28.963 27.132H32.803L38.5 20.924V0.814003H32.88V18.142C30.616 16.534 29.026 14.544 29.026 12.18C29.026 11.266 29.18 10.43 29.572 9.63L23.233 0.814003H17.915V5.386H12.215V27.132H17.915Z" fill="#844BD9"/><path d="M12.215 5.386V0.814003H0V5.386H12.215Z" fill="#844BD9"/></svg>;

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [product, setProduct] = useState<CheckoutProduct | null>(null);
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
      email: "",
      country: "india",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "karnataka",
      zip: "",
      phone: "",
      saveInfo: false,
      emailOffers: false,
      textOffers: false,
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
  }, [id]);

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
        // In a real app, you would send this to your server for verification
        console.log('Payment successful:', response);
        
        const finalOrderData = {
          ...orderData,
          paymentId: response.razorpay_payment_id,
          paymentStatus: 'paid',
        }
        await addDoc(collection(db, "orders"), finalOrderData);

        toast({
          title: 'Payment Successful!',
          description: `Your order for ${orderData.productName} has been placed.`,
        });
        form.reset();
        setIsProcessing(false);
        // Potentially redirect to an order confirmation page
        // router.push('/order-success');
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
    
    const orderData = {
        customerName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        address: `${data.address}, ${data.apartment}, ${data.city}, ${data.state}, ${data.zip}, ${data.country}`,
        productName: product.name,
        amount: product.price + 40,
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
            const codOrderData = { ...orderData, paymentStatus: 'pending' };
            await addDoc(collection(db, "orders"), codOrderData);
            toast({
              title: "Order Placed!",
              description: "Your order has been placed successfully. You will pay on delivery.",
            });
            form.reset();
            setIsProcessing(false);
        }

    } catch (error) {
        console.error("Error processing order: ", error);
        toast({
            title: "Error",
            description: "There was a problem placing your order. Please try again.",
            variant: "destructive",
        });
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
                                    <p className="text-gray-600">Quantity: 1</p>
                                    <p className="text-xl font-bold text-gray-900 mt-2">₹{product.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <Separator className="my-6" />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-800">₹{product.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-gray-800">₹40.00</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>₹{(product.price + 40).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right side: Contact, Delivery, Payment */}
                    <div className="w-full lg:w-2/3 lg:order-1 space-y-8">
                        
                        {/* Contact & Delivery Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold text-gray-800">Contact & Delivery</h2>
                                <Link href="#" className="text-sm text-blue-600 hover:underline">Log in</Link>
                            </div>
                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="emailOffers"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <Label htmlFor="offers" className="font-normal text-gray-600 cursor-pointer">Email me with news and offers</Label>
                                        </FormItem>
                                    )}
                                />
                                
                                <Separator />

                                <h3 className="text-lg font-semibold text-gray-700">Delivery</h3>
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
                                    
                                    <FormField control={form.control} name="saveInfo" render={({ field }) => ( <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label className="font-normal text-gray-600 cursor-pointer">Save this information for next time</Label></FormItem> )} />
                                    <FormField control={form.control} name="textOffers" render={({ field }) => ( <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label className="font-normal text-gray-600 cursor-pointer">Text me with news and offers</Label></FormItem> )} />
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
