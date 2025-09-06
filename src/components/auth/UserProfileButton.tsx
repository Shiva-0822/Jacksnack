
"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { getFirebaseAuth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import LoginModal from './LoginModal';

export default function UserProfileButton() {
  const { user, loading } = useAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    } catch (error) {
      console.error('Error signing out: ', error);
      toast({ title: 'Logout Failed', description: 'Could not log you out. Please try again.', variant: 'destructive' });
    }
  };

  if (loading) {
    return <Button variant="ghost" className="w-24 h-9 rounded-md animate-pulse bg-gray-200" />;
  }

  if (!user) {
    return (
      <>
        <Button onClick={() => setLoginModalOpen(true)}>
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
        <LoginModal open={isLoginModalOpen} onOpenChange={setLoginModalOpen} />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
               {user.photoURL ? (
                <AvatarImage src={user.photoURL} alt={user.displayName || user.email || 'User'} />
              ) : (
                <AvatarFallback>
                    <UserIcon className="h-5 w-5" />
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.displayName || 'Welcome'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LoginModal open={isLoginModalOpen} onOpenChange={setLoginModalOpen} />
    </>
  );
}
