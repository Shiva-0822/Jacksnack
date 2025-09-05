
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/buy/Header';
import Footer from '@/components/buy/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      setAuth(getFirebaseAuth());
    } catch(e) {
      console.error(e);
      toast({
            title: "Authentication Unavailable",
            description: "Firebase is not configured correctly. Please check your environment variables.",
            variant: "destructive",
        });
    }
  }, [toast]);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        toast({
            title: "Authentication Unavailable",
            description: "Firebase is not configured correctly. Please check your environment variables.",
            variant: "destructive",
        });
        return;
    }
    setIsLoading(true);

    try {
      if (isSigningUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Account Created!',
          description: 'You have been successfully signed up and logged in.',
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Login Successful!',
          description: 'Welcome back!',
        });
      }
      router.push('/buy');
    } catch (error: any) {
      toast({
        title: 'Authentication Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{isSigningUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
            <CardDescription>{isSigningUp ? 'Fill in the details below to create your account.' : 'Please enter your credentials to log in.'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuthAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder='******'
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : (isSigningUp ? 'Sign Up' : 'Log In')}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSigningUp ? 'Already have an account?' : "Don't have an account?"}
                <Button
                  variant="link"
                  onClick={() => setIsSigningUp(!isSigningUp)}
                  className="font-semibold text-blue-600"
                  disabled={isLoading}
                >
                  {isSigningUp ? 'Log in' : 'Sign up'}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
