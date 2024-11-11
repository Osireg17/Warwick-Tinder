'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { auth } from '@/lib/appwrite'
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address" })
        .refine((email) => /^[a-zA-Z0-9._%+-]+@(warwick\.ac\.uk|live\.warwick\.ac\.uk)$/.test(email), {
            message: "Please use your Warwick University email"
        }),
})

type FormData = z.infer<typeof formSchema>

export default function ResetPassword() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: FormData) {
        try {
            setIsLoading(true)

            await auth.createRecovery(
                values.email,
                `${window.location.origin}/auth/reset-password/confirm`
            )

            setEmailSent(true)
            toast({
                title: "Recovery Email Sent",
                description: "Please check your email for password reset instructions.",
            })

        } catch (error) {
            console.error('Password reset error:', error)
            toast({
                title: "Error",
                description: "Failed to send recovery email. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (emailSent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <KeyRound className="h-12 w-12 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
                        <CardDescription className="text-center">
                            We&apos;ve sent password reset instructions to your email address.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setEmailSent(false)}
                        >
                            Send Another Email
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <KeyRound className="h-12 w-12 text-rose-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email address and we&apos;ll send you instructions to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Warwick Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="u1234567@warwick.ac.uk"
                                                type="email"
                                                autoCapitalize="none"
                                                autoComplete="email"
                                                autoCorrect="off"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Instructions...
                                    </>
                                ) : (
                                    "Send Reset Instructions"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
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