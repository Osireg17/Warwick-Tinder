'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Loader2, RefreshCcw } from "lucide-react"
import { useUser } from '../hooks/useUser'
import { database } from '@/lib/appwrite'
import { useToast } from "@/hooks/use-toast"
import { QuestionnaireData } from '@/types/questionnaire'
import { Query } from 'appwrite'

interface QuestionnaireResponse extends QuestionnaireData {
    $id: string
    userId: string
    submittedAt: string
}

export default function AdminPage() {
    const { loading } = useUser()
    const { toast } = useToast()
    const [isDownloading, setIsDownloading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [responses, setResponses] = useState<QuestionnaireResponse[]>([])
    const [progress, setProgress] = useState({ current: 0, total: 0 })

    const fetchAllResponses = async () => {
        setIsLoading(true)
        setResponses([])
        try {
            let allResponses: QuestionnaireResponse[] = []
            let lastId = null
            let hasMore = true

            // Get initial total
            const initial = await database.listDocuments(
                process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
                [Query.limit(25)]
            )
            const totalDocuments = initial.total

            setProgress({ current: 0, total: totalDocuments })

            while (hasMore) {
                const queries = [Query.limit(25)]
                if (lastId) {
                    queries.push(Query.cursorAfter(lastId))
                }

                const response = await database.listDocuments(
                    process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
                    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
                    queries
                )

                const newResponses = response.documents as unknown as QuestionnaireResponse[]

                if (newResponses.length === 0) {
                    hasMore = false
                } else {
                    allResponses = [...allResponses, ...newResponses]
                    lastId = newResponses[newResponses.length - 1].$id
                    setProgress({ current: allResponses.length, total: totalDocuments })

                    // Check if we've reached the total
                    if (allResponses.length >= totalDocuments) {
                        hasMore = false
                    }
                }
            }

            setResponses(allResponses)
            toast({
                title: "Success",
                description: `Loaded ${allResponses.length} responses successfully.`,
            })
        } catch (error) {
            console.error('Error fetching all responses:', error)
            toast({
                title: "Error",
                description: "Failed to load all responses.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
            setProgress({ current: 0, total: 0 })
        }
    }

    useEffect(() => {
        fetchAllResponses()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function downloadCSV() {
        try {
            setIsDownloading(true)

            const allKeys = new Set<string>()
            responses.forEach(response => {
                Object.keys(response).forEach(key => {
                    if (!key.startsWith('$') && key !== 'userId') {
                        allKeys.add(key)
                    }
                })
            })

            const headers = ['submittedAt', ...Array.from(allKeys)].join(',')

            const rows = responses.map(response => {
                const row = [response.submittedAt]
                allKeys.forEach(key => {
                    const value = response[key] || ''
                    const escapedValue = `"${String(value).replace(/"/g, '""')}"`
                    row.push(escapedValue)
                })
                return row.join(',')
            })

            const csv = [headers, ...rows].join('\n')

            const blob = new Blob([csv], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `questionnaire-responses-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)

            toast({
                title: "Success",
                description: "CSV file downloaded successfully.",
            })
        } catch (error) {
            console.error('Error downloading CSV:', error)
            toast({
                title: "Error",
                description: "Failed to download CSV file.",
                variant: "destructive",
            })
        } finally {
            setIsDownloading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Questionnaire Responses</CardTitle>
                    <CardDescription>
                        Download and view all questionnaire submissions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-600">
                                    Total Responses: {responses.length}
                                </p>
                                {isLoading && progress.total > 0 && (
                                    <p className="text-xs text-gray-500">
                                        Loading responses... ({progress.current} of {progress.total})
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={fetchAllResponses}
                                    disabled={isLoading}
                                >
                                    <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </Button>
                                <Button
                                    onClick={downloadCSV}
                                    disabled={isDownloading || responses.length === 0}
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download CSV
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}