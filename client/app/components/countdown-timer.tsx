'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeLeft } from "@/types";

interface CountdownTimerProps {
    timeLeft: TimeLeft;
}


export const CountdownTimer = ({ timeLeft }: CountdownTimerProps) => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-gray-800">
                        Event Countdown
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-center">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="bg-rose-50 rounded-lg p-4">
                                <span className="text-3xl font-bold text-rose-600">{value}</span>
                                <p className="text-gray-600 capitalize">{unit}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};