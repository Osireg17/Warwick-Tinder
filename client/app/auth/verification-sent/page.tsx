'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast"
import { auth } from '@/lib/appwrite'

export default function VerificationSent() {
    const { toast } = useToast()

    const resendVerification = async () => {
        try {
            await auth.createVerification(
                `${window.location.origin}/auth/verify`
            )

            toast({
                title: "Verification Email Sent",
                description: "Please check your inbox for the verification link.",
            })
        } catch (error) {
            console.error('Error resending verification:', error)
            toast({
                title: "Error",
                description: "Failed to resend verification email. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <Mail className="h-12 w-12 text-rose-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
                    <CardDescription className="text-center">
                        We&apos;ve sent you a verification link. Please check your email to verify your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-gray-600">
                    <p>Didn&apos;t receive the email? Check your spam folder or click below to resend.</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button onClick={resendVerification} variant="outline" className="w-full">
                        Resend Verification Email
                    </Button>
                    <Button asChild variant="ghost" className="w-full">
                        <Link href="/auth/signin">
                            Back to Sign In
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}