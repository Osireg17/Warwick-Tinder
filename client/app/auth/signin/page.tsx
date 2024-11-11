'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/appwrite'
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address" })
        .refine((email) => /^[a-zA-Z0-9._%+-]+@(warwick\.ac\.uk|live\.warwick\.ac\.uk)$/.test(email), {
            message: "Please use your Warwick University email"
        }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

type FormData = z.infer<typeof formSchema>

export default function SignIn() {
    const { toast } = useToast()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: FormData) {
        try {
            setIsLoading(true)

            await auth.createEmailPasswordSession(values.email, values.password)

            toast({
                title: "Welcome back!",
                description: "You've been successfully signed in.",
            })

            // Go straight to questionnaire
            router.push('/questionnaire')

        } catch (error: unknown) {
            console.error('Sign in error:', error)

            let errorMessage = "Failed to sign in. Please try again."

            type AuthError = {
                type: 'user_invalid_credentials' | 'user_not_found'
            }

            if ((error as AuthError).type === 'user_invalid_credentials') {
                errorMessage = "Invalid email or password"
            } else if ((error as AuthError).type === 'user_not_found') {
                errorMessage = "No account found with this email"
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                    <Link href="/" className="hover:opacity-90 transition-opacity">
                        <Heart className="h-12 w-12 text-rose-500" />
                    </Link>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Sign in to Love Connect</CardTitle>
                <CardDescription className="text-center">
                    Enter your Warwick email and password to access your account
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
                                            placeholder="u1234567@live.warwick.ac.uk"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Please use:
                                        <br />
                                        • Student ID format: u1234567@live.warwick.ac.uk
                                    </p>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            autoComplete="current-password"
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
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <Button
                    variant="link"
                    asChild
                    className="text-sm text-gray-600 hover:text-rose-600"
                >
                    <Link href="/auth/reset-password">
                        Forgot your password?
                    </Link>
                </Button>
                <div className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="text-rose-600 hover:underline">
                        Register here
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}