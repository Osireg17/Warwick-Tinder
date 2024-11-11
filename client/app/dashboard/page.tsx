'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useUser } from '../hooks/useUser'
import { useRouter } from 'next/navigation'
import { database } from '@/lib/appwrite'
import { Query } from 'appwrite'
import { ExternalLink, Loader2, Heart, Calendar, Clock, MapPin, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react'
import { EVENT_INFO } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface MatchStatus {
    hasSubmittedQuestionnaire: boolean
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
                    hasMatch: false,
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100">
                <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-lg shadow-lg">
                    <Loader2 className="h-12 w-12 animate-spin text-rose-500" />
                    <span className="text-xl text-gray-700">Loading your love journey...</span>
                </div>
            </div>
        )
    }

    const renderProgressBar = () => {
        let progress = 0
        if (matchStatus.hasSubmittedQuestionnaire) progress += 50
        if (matchStatus.hasMatch) progress += 50

        return (
            <div className="w-full mt-4">
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>Questionnaire</span>
                    <span>Match</span>
                </div>
            </div>
        )
    }

    const renderMatchStatus = () => {
        if (!matchStatus.hasSubmittedQuestionnaire) {
            return (
                <Card className="bg-gradient-to-br from-amber-100 to-amber-200 border-none">
                    <CardHeader>
                        <CardTitle className="text-amber-800 flex items-center gap-2">
                            <AlertTriangle className="h-6 w-6" />
                            Action Required
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-amber-800 mb-4">
                            Start your journey to find your perfect match by completing our questionnaire!
                        </p>
                        <Button asChild className="bg-amber-600 hover:bg-amber-700">
                            <Link href="/questionnaire">
                                Complete Questionnaire
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )
        }

        if (matchStatus.hasSubmittedQuestionnaire && !matchStatus.hasMatch) {
            return (
                <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-none">
                    <CardHeader>
                        <CardTitle className="text-blue-800 flex items-center gap-2">
                            <ExternalLink className="h-6 w-6" />
                            Secure Your Spot
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-blue-800 mb-4">
                            Great progress! Now it&apos;s time to purchase your ticket and get ready for an unforgettable evening.
                        </p>
                        <a
                            href="https://www.warwicksu.com/venues-events/events/4216/26199/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                        >
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
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
                <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-none">
                    <CardHeader>
                        <CardTitle className="text-purple-800 flex items-center gap-2">
                            <Heart className="h-6 w-6" />
                            Finding Your Match
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-purple-800">
                            Exciting times ahead! Our cupids are working their magic to find your perfect match. We&apos;ll notify you as soon as we find someone compatible.
                        </p>
                    </CardContent>
                </Card>
            )
        }

        return (
            <Card className="bg-gradient-to-br from-green-100 to-green-200 border-none">
                <CardHeader>
                    <CardTitle className="text-green-800 flex items-center gap-2">
                        <Heart className="h-6 w-6 fill-green-800" />
                        Match Found!
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-green-800 mb-4">
                        Congratulations! We&apos;ve found your perfect match. Check your email for more details about your exciting date.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                        View Match Details
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card className="border-none bg-white bg-opacity-80 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-800">Welcome, {user?.name}! 👋</CardTitle>
                        <CardDescription className="text-lg text-gray-600">
                            Your First Date experience awaits. Let&apos;s make it unforgettable!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderProgressBar()}
                    </CardContent>
                </Card>

                {renderMatchStatus()}

                <Card className="border-none bg-white bg-opacity-80 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl text-gray-800">
                            <Calendar className="h-6 w-6 text-rose-500" />
                            Event Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-700">
                                <Calendar className="h-5 w-5 text-rose-500" />
                                <span className="text-lg">{EVENT_INFO.date}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Clock className="h-5 w-5 text-rose-500" />
                                <span className="text-lg">{EVENT_INFO.time}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-700">
                                <MapPin className="h-5 w-5 text-rose-500" />
                                <span className="text-lg">{EVENT_INFO.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <CheckCircle className="h-5 w-5 text-rose-500" />
                                <span className="text-lg">{EVENT_INFO.dressCode}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-white bg-opacity-80 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl text-gray-800">
                            <HelpCircle className="h-6 w-6 text-rose-500" />
                            Need Assistance?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-700 text-lg">
                            We&apos;re here to ensure your First Date experience is smooth and enjoyable. Don&apos;t hesitate to reach out:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button variant="outline" className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                Email Us
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                Follow on Instagram
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}