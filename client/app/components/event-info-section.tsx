'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from 'lucide-react';
import { EventDetail } from "@/types";

const EVENT_DETAILS: EventDetail[] = [
    { icon: Calendar, text: "November 21 & 22, 2024" },
    { icon: Clock, text: "8:00 PM" },
    { icon: MapPin, text: "The Grand Ballroom, 123 Love Street, Cityville" },
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
                            Experience the thrill of meeting new people in a carefully curated environment.
                            Our blind date event is designed to spark genuine connections and create lasting memories.
                            Whether you&apos;re searching for love or expanding your social circle, this evening promises
                            excitement, laughter, and the potential for something special.
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
