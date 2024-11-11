'use client';
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LIKERT_OPTIONS, questionnaireService, QUESTIONS } from '@/lib/questionnaire'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '../hooks/useUser'
import { QuestionnaireData } from '@/types/questionnaire'

const formSchema = z.object({
    studentId: z.string().min(1, { message: "Student ID is required" }),
    identity: z.string().min(1, { message: "Identity is required" }),
    yearOfStudy: z.string().min(1, { message: "Year of study is required" }),
    preferredDate: z.string().refine(value => ['2024-11-21', '2024-11-22'].includes(value), {
        message: "Please select one of the available dates"
    }),
    yearPreference: z.string().min(1, { message: "Year preference is required" }),
    dateType: z.string().min(1, { message: "Date type is required" }),
    dateFormat: z.string().min(1, { message: "Date format is required" }),
    partnerPreference: z.string().min(1, { message: "Partner preference is required" }),
    ...Object.fromEntries(QUESTIONS.map(q => [
        q.key,
        z.number().min(1).max(5)
    ]))
}) as z.ZodType<QuestionnaireData>;

type FormData = z.infer<typeof formSchema>

export default function Questionnaire() {
    const { toast } = useToast()
    const router = useRouter()
    const { user, loading } = useUser()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [formDataToSubmit, setFormDataToSubmit] = useState<FormData | null>(null)
    const totalSteps = 6

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: '',
            identity: '',
            yearOfStudy: '',
            preferredDate: '',
            yearPreference: '',
            dateType: '',
            dateFormat: '',
            ...Object.fromEntries(QUESTIONS.map(q => [q.key, 0]))
        },
    })

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">Please sign in to access the questionnaire.</p>
            </div>
        )
    }

    const handleSubmit = (data: FormData) => {
        setFormDataToSubmit(data)
        setShowConfirmDialog(true)
    }

    async function onSubmit() {
        if (!formDataToSubmit || !user) {
            toast({
                title: "Error",
                description: !user ? "Please log in to submit" : "Please complete the questionnaire",
                variant: "destructive",
            })
            return
        }

        try {
            setIsSubmitting(true)
            await questionnaireService.submitQuestionnaire(formDataToSubmit, user.$id)

            toast({
                title: "Success!",
                description: "Your questionnaire has been submitted. Time to get your tickets!",
            })

            router.push('/confirmation')

        } catch (error: unknown) {
            console.error('Submission error:', error)

            const errorMessage = (error as { type?: string; message?: string }).type === 'user_unauthorized'
                ? 'Please log in to submit the questionnaire'
                : (error as { message?: string }).message || "Failed to submit questionnaire. Please try again."

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
            setShowConfirmDialog(false)
        }
    }

    const nextStep = () => {
        if (step === 1) {
            form.trigger(['studentId', 'identity', 'yearOfStudy', 'preferredDate']).then((isValid) => {
                if (isValid) setStep(current => current + 1)
            })
        } else if (step === 2) {
            form.trigger(['yearPreference', 'dateType', 'dateFormat', 'partnerPreference']).then((isValid) => {
                if (isValid) setStep(current => current + 1)
            })
        } else {
            setStep(current => Math.min(current + 1, totalSteps))
        }
    }

    const prevStep = () => {
        setStep(current => Math.max(current - 1, 1))
    }

    const getCurrentQuestions = () => {
        if (step <= 2) return []
        const startIndex = (step - 3) * 7
        return QUESTIONS.slice(startIndex, startIndex + 7)
    }

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Basic Information"
            case 2: return "Your Preferences"
            case 3: return "Personality Questions (1/4)"
            case 4: return "Personality Questions (2/4)"
            case 5: return "Personality Questions (3/4)"
            case 6: return "Personality Questions (4/4)"
            default: return ""
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 py-12">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Love Connect Questionnaire</CardTitle>
                        <CardDescription className="text-center">{getStepTitle()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(step / totalSteps) * 100} className="mb-4" />
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                {step === 1 && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="studentId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Student ID</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your student ID" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="identity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>I identify as...</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select your identity" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="male">Male</SelectItem>
                                                            <SelectItem value="female">Female</SelectItem>
                                                            <SelectItem value="non-binary">Non-binary</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="preferredDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Which day would you prefer the date to be on?</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select your preferred date" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="2024-11-21">Thursday, November 21st</SelectItem>
                                                            <SelectItem value="2024-11-22">Friday, November 22nd</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        Choose between our two event dates
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="yearOfStudy"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Which year are you in?</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select your year of study" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">1st Year</SelectItem>
                                                            <SelectItem value="2">2nd Year</SelectItem>
                                                            <SelectItem value="3">3rd Year</SelectItem>
                                                            <SelectItem value="4">4th Year</SelectItem>
                                                            <SelectItem value="postgraduate">Postgraduate</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="dateType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>I want to go on a...</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select date type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="romantic">Romantic Date</SelectItem>
                                                            <SelectItem value="friend">Friend Date</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="yearPreference"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>I would like to go on a date with someone who is...</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select your preference" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Same year as me">Same year as me</SelectItem>
                                                            <SelectItem value="Different year as me">Different year as me</SelectItem>
                                                            <SelectItem value="Open to any year">Open to any year</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="dateFormat"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>I want a...</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Date preference" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="One-on-one">One-on-one date</SelectItem>
                                                            <SelectItem value="Double date (Matched with another date pair)">Double date (Matched with another date pair)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="partnerPreference"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>I am interested in....</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Date preference" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="men">Men</SelectItem>
                                                            <SelectItem value="women">Women</SelectItem>
                                                            <SelectItem value="everyone">Everyone</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                {step >= 3 && step <= 6 && (
                                    <div className="space-y-8">
                                        {getCurrentQuestions().map((question) => (
                                            <FormField
                                                key={question.key}
                                                control={form.control}
                                                name={question.key}
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel>{question.label}</FormLabel>
                                                        <FormControl>
                                                            <RadioGroup
                                                                onValueChange={(value) => field.onChange(parseInt(value, 10))}
                                                                defaultValue={field.value?.toString()}
                                                                className="grid grid-cols-5 gap-8"
                                                            >
                                                                {LIKERT_OPTIONS.map((option) => (
                                                                    <FormItem
                                                                        key={option.value}
                                                                        className="flex flex-col items-center space-y-2"
                                                                    >
                                                                        <FormControl>
                                                                            <RadioGroupItem
                                                                                value={option.value.toString()}
                                                                                className="h-5 w-5 border-2 border-rose-400 text-rose-500"
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="font-normal text-sm text-center">
                                                                            {option.label}
                                                                        </FormLabel>
                                                                    </FormItem>
                                                                ))}
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {step > 1 && (
                            <Button
                                onClick={prevStep}
                                variant="outline"
                                disabled={isSubmitting}
                            >
                                Previous
                            </Button>
                        )}
                        {step < totalSteps ? (
                            <Button
                                onClick={nextStep}
                                disabled={isSubmitting}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={form.handleSubmit(handleSubmit)}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Submitting...
                                    </div>
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to submit your questionnaire? You won&apos;t be able to modify your answers after submission.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onSubmit}
                            disabled={isSubmitting}
                            className="bg-rose-500 hover:bg-rose-600"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Submitting...
                                </div>
                            ) : (
                                "Confirm Submission"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
