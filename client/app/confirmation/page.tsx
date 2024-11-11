'use client'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Calendar, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { EVENT_INFO } from '@/lib/constants'
import { useUser } from '../hooks/useUser'

export default function Confirmation() {
    const router = useRouter()
    const { user, loading } = useUser()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/signin')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex justify-center mb-6">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-center">
                        Questionnaire Complete!
                    </CardTitle>
                    <CardDescription className="text-center text-lg mt-2">
                        Thank you for completing the questionnaire. You&apos;re one step closer to your perfect match!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-rose-50 p-6 rounded-lg space-y-4">
                        <h3 className="text-xl font-semibold text-rose-700 flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Next Steps
                        </h3>
                        <div className="space-y-2 text-rose-600">
                            <p>1. Purchase your ticket through the Warwick SU website</p>
                            <p>2. Wait for our matching algorithm to find your perfect match</p>
                            <p>3. We&apos;ll notify you when we&apos;ve found your match!</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-700 mb-3">Event Details</h3>
                        <ul className="space-y-2 text-blue-600">
                            <li>📅 Date: {EVENT_INFO.date}</li>
                            <li>⏰ Time: {EVENT_INFO.time}</li>
                            <li>📍 Location: {EVENT_INFO.location}</li>
                            <li>👔 Dress Code: {EVENT_INFO.dressCode}</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <a
                        href="https://www.warwicksu.com/venues-events/events/4216/26199/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                    >
                        <Button
                            className="w-full bg-[#9D2235] hover:bg-[#7d1b2a] text-white py-6"
                        >
                            <ExternalLink className="mr-2 h-5 w-5" />
                            Purchase Tickets on Warwick SU
                        </Button>
                    </a>
                    {/* <Button asChild variant="outline" className="w-full">
                        <Link href="/dashboard">
                            Go to Dashboard
                        </Link>
                    </Button> */}
                </CardFooter>
            </Card>
        </div>
    )
}