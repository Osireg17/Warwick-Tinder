'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CTASection = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Ready to Find Your Match?
            </h2>
            <Button size="lg" className="text-lg px-8 py-6">
                <Link href="/auth/register">
                    Register Now
                </Link>
            </Button>
        </section>
    );
};