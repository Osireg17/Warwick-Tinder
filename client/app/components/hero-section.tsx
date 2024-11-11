'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const HeroSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                Find Your Perfect Match
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Join us for an unforgettable evening of connections and new beginnings
            </p>
            <Button size="lg" className="text-lg px-8 py-6">
                <Link href="/auth/register">
                    Reserve Your Spot
                </Link>
            </Button>
        </section>
    );
};