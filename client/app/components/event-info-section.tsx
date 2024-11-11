'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, PoundSterling } from 'lucide-react';
import { EventDetail } from "@/types";

const EVENT_DETAILS: EventDetail[] = [
    { icon: Calendar, text: "November 21 & 22, 2024" },
    { icon: Clock, text: "8:00 PM - 10:00PM" },
    { icon: MapPin, text: "Esquires, Leamington Spa CV32 5JS" },
    { icon: PoundSterling, text: "Price: £6" }
];

export const EventInfoSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            About the Event
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">
                            Want to get cuffed this holiday season?🥰 Want to make new friends before the term ends?🤝Look no further, we have the solution for you! (Best part: you help raise money for the charity Movember!) 🥳
                        </p>
                        <p className="text-gray-600 mb-4">
                            Join us as we pair you with a mystery date carefully selected for you using an algorithm powered by Warwick Data Science Society📲Just fill our form and let us do the work to find you the perfect date!🫶
                        </p>
                        <p className="text-gray-600 mb-4">
                            Options for romantic dates and friendship dates are available! There will also be additional drinks and a dessert menu available on the day to order!🍹🍨
                        </p>
                        <Button variant="outline" className="w-full">Learn More</Button>
                    </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Event Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {EVENT_DETAILS.map((detail, index) => (
                                <li key={index} className="flex items-center">
                                    <detail.icon className="h-6 w-6 text-rose-500 mr-2" />
                                    <span>{detail.text}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};
