import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { UseFormReturn } from 'react-hook-form';

import type { LikertQuestion } from '@/types/questionnaire';
import { LIKERT_OPTIONS } from "@/lib/questionnaire";

interface LikertQuestionsProps {
    questions: LikertQuestion[];
    form: UseFormReturn<Record<string, string>>;
}

export function LikertQuestions({ questions, form }: LikertQuestionsProps) {
    return (
        <div className="space-y-4">
            {questions.map((question) => (
                <FormField
                    key={question.key}
                    control={form.control}
                    name={question.key}
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
    );
}