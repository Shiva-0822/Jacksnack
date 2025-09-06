
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { X, BotMessageSquare, BadgeCheck, ShieldCheck, Truck, KeyRound, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getFirebaseAuth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleAuthError = (error: AuthError) => {
    let message = "An unexpected error occurred.";
    switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            message = "Invalid email or password. Please try again.";
            break;
        case 'auth/email-already-in-use':
            message = "This email address is already in use.";
            break;
        case 'auth/weak-password':
            message = "The password is too weak. Please use at least 6 characters.";
            break;
        case 'auth/invalid-email':
            message = "Please enter a valid email address.";
            break;
        default:
            console.error("Firebase Auth Error:", error);
            break;
    }
    toast({ title: "Authentication Failed", description: message, variant: "destructive" });
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const auth = getFirebaseAuth();
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Login Successful!", description: "Welcome back!" });
        onOpenChange(false);
    } catch (error) {
        handleAuthError(error as AuthError);
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const auth = getFirebaseAuth();
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Sign Up Successful!", description: "Welcome! You are now logged in." });
        onOpenChange(false);
    } catch (error) {
        handleAuthError(error as AuthError);
    }
    setIsLoading(false);
  };
  
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setIsLoading(false);
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        resetForm();
    }
    onOpenChange(isOpen);
  }

  if (user) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 max-w-md md:max-w-3xl bg-transparent border-none shadow-2xl m-4">
        <div className="flex flex-col md:flex-row">
          <div className="bg-black text-white p-6 rounded-t-lg md:rounded-t-none md:rounded-l-lg relative md:w-1/2 order-1">
            <DialogHeader className="p-0 relative">
                <DialogTitle className="text-2xl font-bold mb-1 text-left text-white">Welcome to Jacksnack</DialogTitle>
                <DialogDescription className="text-left text-gray-400">
                    Sign in or create an account
                </DialogDescription>
            </DialogHeader>
            <DialogClose className="absolute top-2 right-2 text-gray-500 hover:text-white">
              <X className="w-5 h-5"/>
            </DialogClose>

            <Tabs defaultValue="signin" className="w-full mt-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                    <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-black border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 h-11 text-base"
                    />
                     <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-black border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 h-11 text-base"
                    />
                    <Button type="submit" className="w-full bg-red-800 hover:bg-red-700 h-11 text-base font-bold" disabled={isLoading}>
                        <KeyRound className="mr-2 h-5 w-5" />
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                    <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-black border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 h-11 text-base"
                    />
                     <Input
                        type="password"
                        placeholder="Create a Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-black border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 h-11 text-base"
                    />
                    <Button type="submit" className="w-full bg-red-800 hover:bg-red-700 h-11 text-base font-bold" disabled={isLoading}>
                        <UserPlus className="mr-2 h-5 w-5" />
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>
              </TabsContent>
            </Tabs>
            <p className="text-[10px] text-gray-500 mt-4">
                By continuing, I accept Jacksnack&apos;s <a href="#" className="text-white hover:underline">Terms</a> & <a href="#" className="text-white hover:underline">Privacy Policy</a>.
            </p>
          </div>

          <div className="flex flex-col bg-gray-100 p-6 rounded-b-lg md:rounded-b-none md:rounded-r-lg md:w-1/2 order-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Why choose Jacksnack?</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-full p-2 shadow-md">
                    <BadgeCheck className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-700 text-sm">Quality</h3>
                    <p className="text-xs text-gray-500">Best quality products</p>
                </div>
              </div>
               <div className="flex items-center gap-3">
                <div className="bg-white rounded-full p-2 shadow-md">
                    <BotMessageSquare className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-700 text-sm">On time</h3>
                    <p className="text-xs text-gray-500">On time delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-full p-2 shadow-md">
                    <ShieldCheck className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-700 text-sm">Return Policy</h3>
                    <p className="text-xs text-gray-500">Easy return policy</p>
                </div>
              </div>
               <div className="flex items-center gap-3">
                <div className="bg-white rounded-full p-2 shadow-md">
                    <Truck className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-700 text-sm">Free Delivery</h3>
                    <p className="text-xs text-gray-500">Free delivery on all orders</p>
                </div>
              </div>
            </div>
             <div className="border-t my-6"></div>
             <p className="text-xs font-semibold text-gray-600 mb-2">Find us on</p>
             <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
