'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from '../hooks/useUser'
import { useRouter } from 'next/navigation'
import { database } from '@/lib/appwrite'
import { Query } from 'appwrite'
import { ExternalLink, Loader2, Heart, Calendar, Clock, MapPin, AlertTriangle } from 'lucide-react'
import { EVENT_INFO } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface MatchStatus {
    hasSubmittedQuestionnaire: boolean
    hasPurchasedTicket: boolean
    hasMatch: boolean
    matchDetails?: {
        name: string
        matchedAt: string
    }
}

export default function Dashboard() {
    const { user, loading } = useUser()
    const router = useRouter()
    const { toast } = useToast()
    const [matchStatus, setMatchStatus] = useState<MatchStatus>({
        hasSubmittedQuestionnaire: false,
        hasPurchasedTicket: false,
        hasMatch: false
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/signin')
        }
    }, [user, loading, router])

    useEffect(() => {
        async function checkMatchStatus() {
            if (!user) return

            try {
                const questionnaires = await database.listDocuments(
                    process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
                    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
                    [Query.equal('userId', user.$id)]
                )

                const hasSubmittedQuestionnaire = questionnaires.documents.length > 0

                setMatchStatus({
                    hasSubmittedQuestionnaire,
                    hasPurchasedTicket: false, // This would come from your ticket system
                    hasMatch: false, // This would come from your matching system
                })
            } catch (error) {
                console.error('Error fetching match status:', error)
                toast({
                    title: "Error",
                    description: "Failed to load your match status. Please refresh the page.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        checkMatchStatus()
    }, [user, toast])

    if (loading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
                    <span className="text-lg text-gray-600">Loading your dashboard...</span>
                </div>
            </div>
        )
    }

    const renderMatchStatus = () => {
        if (!matchStatus.hasSubmittedQuestionnaire) {
            return (
                <Card className="bg-amber-50">
                    <CardHeader>
                        <CardTitle className="text-amber-800 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Action Required
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-amber-800 mb-4">
                            You haven&apos;t completed the matching questionnaire yet. Complete it to find your perfect match!
                        </p>
                        <Button asChild>
                            <Link href="/questionnaire">
                                Complete Questionnaire
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )
        }

        if (!matchStatus.hasPurchasedTicket) {
            return (
                <Card className="bg-amber-50">
                    <CardHeader>
                        <CardTitle className="text-amber-800 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Purchase Your Ticket
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-amber-800 mb-4">
                            Great! You&apos;ve completed the questionnaire. Now purchase your ticket to secure your spot!
                        </p>
                        <a
                            href="https://www.warwicksu.com/venues-events/events/4216/26199/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-1/2"
                        >
                            <Button
                                className="w-full bg-[#9D2235] hover:bg-[#7d1b2a] text-white py-6"
                            >
                                <ExternalLink className="mr-2 h-5 w-5" />
                                Purchase Tickets on Warwick SU
                            </Button>
                        </a>
                    </CardContent>
                </Card>
            )
        }

        if (!matchStatus.hasMatch) {
            return (
                <Card className="bg-blue-50">
                    <CardHeader>
                        <CardTitle className="text-blue-800 flex items-center gap-2">
                            <Heart className="h-5 w-5" />
                            Finding Your Match
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-blue-800">
                            We&apos;re working on finding your perfect match! We&apos;ll notify you once we find someone compatible.
                        </p>
                    </CardContent>
                </Card>
            )
        }

        return (
            <Card className="bg-green-50">
                <CardHeader>
                    <CardTitle className="text-green-800 flex items-center gap-2">
                        <Heart className="h-5 w-5 fill-green-800" />
                        Match Found!
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-green-800">
                        Congratulations! We&apos;ve found your match. Check your email for more details about your date.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Welcome, {user?.name}! 👋</CardTitle>
                        <CardDescription>
                            Here&apos;s everything you need to know about your First Date experience
                        </CardDescription>
                    </CardHeader>
                </Card>

                {renderMatchStatus()}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Event Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{EVENT_INFO.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{EVENT_INFO.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{EVENT_INFO.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <span>👔</span>
                            <span>{EVENT_INFO.dressCode}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Need Help?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-gray-600">
                            If you have any questions or need assistance, feel free to reach out to us:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>Email: warwickdatasciencesociety@gmail.com</li>
                            <li>Instagram: @warwickdatasciencesociety</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}