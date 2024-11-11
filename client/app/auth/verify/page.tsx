'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { auth } from '@/lib/appwrite'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmail() {
    const searchParams = useSearchParams()
    const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading')
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const userId = searchParams.get('userId')
        const secret = searchParams.get('secret')

        if (!userId || !secret) {
            setVerificationState('error')
            setError('Invalid verification link')
            return
        }

        const verifyEmail = async () => {
            try {
                await auth.updateVerification(userId, secret)
                setVerificationState('success')
            } catch (error) {
                console.error('Verification error:', error)
                setVerificationState('error')
                setError('Failed to verify email. The link may have expired.')
            }
        }

        verifyEmail()
    }, [searchParams])

    const renderContent = () => {
        switch (verificationState) {
            case 'loading':
                return (
                    <>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">Verifying Your Email</CardTitle>
                            <CardDescription className="text-center">
                                Please wait while we verify your email address...
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                        </CardContent>
                    </>
                )
            case 'success':
                return (
                    <>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center text-green-600">
                                <div className="flex items-center justify-center gap-2">
                                    <CheckCircle2 className="h-8 w-8" />
                                    Email Verified!
                                </div>
                            </CardTitle>
                            <CardDescription className="text-center">
                                Your email has been successfully verified.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-center">
                            <Button asChild>
                                <Link href="/questionnaire">
                                    Continue to Questionnaire
                                </Link>
                            </Button>
                        </CardFooter>
                    </>
                )
            case 'error':
                return (
                    <>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center text-red-600">
                                <div className="flex items-center justify-center gap-2">
                                    <XCircle className="h-8 w-8" />
                                    Verification Failed
                                </div>
                            </CardTitle>
                            <CardDescription className="text-center text-red-600">
                                {error}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-center">
                            <Button asChild variant="outline">
                                <Link href="/auth/register">
                                    Back to Registration
                                </Link>
                            </Button>
                        </CardFooter>
                    </>
                )
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                {renderContent()}
            </Card>
        </div>
    )
}