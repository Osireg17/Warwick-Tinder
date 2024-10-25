'use client'
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md fixed w-full z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            href="/"
            className="flex-shrink-0 flex items-center hover:opacity-90 transition-opacity"
          >
            <Heart className="h-8 w-8 text-rose-500" />
            <span className="ml-2 text-2xl font-bold text-gray-800">First Date</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};