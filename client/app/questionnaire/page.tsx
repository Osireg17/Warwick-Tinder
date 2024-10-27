'use client'

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
import { LIKERT_OPTIONS, QUESTIONS } from '@/lib/questionnaire'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const formSchema = z.object({
    // Basic info (Step 1)
    studentId: z.string().min(1, { message: "Student ID is required" }),
    identity: z.string().min(1, { message: "Identity is required" }),
    yearOfStudy: z.string().min(1, { message: "Year of study is required" }),
    // Preferences (Step 2)
    partnerPreference: z.string().min(1, { message: "Partner preference is required" }),
    dateType: z.string().min(1, { message: "Date type is required" }),
    relationshipType: z.string().min(1, { message: "Relationship type is required" }),
    interestedIn: z.string().min(1, { message: "Interest is required" }),
    preferredDate: z.string().refine(value => ['2024-11-21', '2024-11-22'].includes(value), {
        message: "Please select one of the available dates"
    }),
    // Likert questions (Steps 3-6)
    ...Object.fromEntries(QUESTIONS.map(q => [q.key, z.string()]))
})

type FormData = z.infer<typeof formSchema> & {
    [key: string]: string;
}

export default function Questionnaire() {
    const [step, setStep] = useState(1)
    const totalSteps = 6

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: '',
            identity: '',
            preferredDate: '',
            yearOfStudy: '',
            partnerPreference: '',
            dateType: '',
            relationshipType: '',
            interestedIn: '',
            ...Object.fromEntries(QUESTIONS.map(q => [q.key, '']))
        },
    })

    function onSubmit(data: FormData) {
        console.log(data)
        // Handle form submission
    }

    const nextStep = () => {
        if (step === 1) {
            // Validate basic info fields
            form.trigger(['studentId', 'identity', 'preferredDate', 'yearOfStudy']).then((isValid) => {
                if (isValid) setStep(current => current + 1)
            })
        } else if (step === 2) {
            // Validate preferences fields
            form.trigger(['partnerPreference', 'dateType', 'relationshipType', 'interestedIn']).then((isValid) => {
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
        if (step <= 2) return [];
        const startIndex = (step - 3) * 7;
        return QUESTIONS.slice(startIndex, startIndex + 7);
    }

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Basic Information";
            case 2: return "Your Preferences";
            case 3: return "Personality Questions (1/4)";
            case 4: return "Personality Questions (2/4)";
            case 5: return "Personality Questions (3/4)";
            case 6: return "Personality Questions (4/4)";
            default: return "";
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 py-12">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Love Connect Questionnaire</CardTitle>
                    <CardDescription className="text-center">{getStepTitle()}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Progress value={(step / totalSteps) * 100} className="mb-4" />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                                        <SelectItem value="other">Other</SelectItem>
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
                                                        <SelectItem value="1">First Year</SelectItem>
                                                        <SelectItem value="2">Second Year</SelectItem>
                                                        <SelectItem value="3">Third Year</SelectItem>
                                                        <SelectItem value="4">Fourth Year</SelectItem>
                                                        <SelectItem value="5+">Fifth Year or above</SelectItem>
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
                                        name="partnerPreference"
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
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                        <SelectItem value="non-binary">Non-binary</SelectItem>
                                                        <SelectItem value="any">Any gender</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                                        <SelectItem value="blind">Blind Date</SelectItem>
                                                        <SelectItem value="activity">Activity Date</SelectItem>
                                                        <SelectItem value="dinner">Dinner Date</SelectItem>
                                                        <SelectItem value="coffee">Coffee Date</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="relationshipType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>I want a...</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select relationship type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="casual">Casual Relationship</SelectItem>
                                                        <SelectItem value="serious">Serious Relationship</SelectItem>
                                                        <SelectItem value="friendship">Friendship</SelectItem>
                                                        <SelectItem value="open">Open to anything</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="interestedIn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>I am interested in...</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select your interests" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="sports">Sports</SelectItem>
                                                        <SelectItem value="music">Music</SelectItem>
                                                        <SelectItem value="art">Art</SelectItem>
                                                        <SelectItem value="technology">Technology</SelectItem>
                                                        <SelectItem value="travel">Travel</SelectItem>
                                                        <SelectItem value="food">Food</SelectItem>
                                                        <SelectItem value="reading">Reading</SelectItem>
                                                        <SelectItem value="movies">Movies</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {step >= 3 && step <= 6 && (
                                <div className="space-y-6">
                                    {getCurrentQuestions().map((question) => (
                                        <FormField
                                            key={question.key}
                                            control={form.control}
                                            name={question.key as string}
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">

                                                    <FormLabel>{question.label}</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                                                        >
                                                            {LIKERT_OPTIONS.map((option) => (
                                                                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <RadioGroupItem value={option.value} />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
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
                        <Button onClick={prevStep} variant="outline">
                            Previous
                        </Button>
                    )}
                    {step < totalSteps ? (
                        <Button onClick={nextStep}>Next</Button>
                    ) : (
                        <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
