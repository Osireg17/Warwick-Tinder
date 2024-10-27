import { LikertOption, LikertQuestion, QuestionnaireData } from "@/types/questionnaire";
import { database } from "./appwrite";
import { ID, Query } from 'appwrite';

export const LIKERT_OPTIONS: LikertOption[] = [
    { value: '1', label: 'Strongly disagree' },
    { value: '2', label: 'Disagree' },
    { value: '3', label: 'Neutral' },
    { value: '4', label: 'Agree' },
    { value: '5', label: 'Strongly agree' },
];

export const QUESTIONS: LikertQuestion[] = [
    { key: 'adventurous', label: 'I like to be adventurous.' },
    { key: 'believeInTrueLove', label: 'I believe in true love.' },
    { key: 'confident', label: 'I am confident.' },
    { key: 'lookingForSerious', label: 'I am looking for something serious.' },
    { key: 'intellectualConversations', label: 'I like to have intellectual conversations.' },
    { key: 'talkingAboutFeelings', label: 'I like talking about my feelings and emotions.' },
    { key: 'extrovert', label: 'I am an extrovert.' },
    { key: 'careAboutEnvironment', label: 'I care about the environment.' },
    { key: 'likeToDance', label: 'I like to dance.' },
    { key: 'religiousConnection', label: 'I have a strong connection with religion.' },
    { key: 'outClubbing', label: 'On a Friday night, I would be most likely out clubbing.' },
    { key: 'closeToFamily', label: 'I believe being close to your family is important.' },
    { key: 'likeToTravel', label: 'I like to travel.' },
    { key: 'swearALot', label: 'I tend to swear a lot.' },
    { key: 'organizedAndTidy', label: 'I am always very organised and tidy.' },
    { key: 'commitmentImportant', label: 'I believe commitment is the most important factor in a relationship.' },
    { key: 'prioritizeAcademics', label: 'I tend to prioritize my academic life over my social life.' },
    { key: 'discussBooksMovies', label: 'I like discussing books or/and movies.' },
    { key: 'laidBack', label: 'I am laid back.' },
    { key: 'likeSarcasticPeople', label: 'I like sarcastic people.' },
    { key: 'decisionBasedOnFeelings', label: 'I tend to base my decisions on feelings rather than rational thinking.' },
    { key: 'openToChangingViews', label: 'In a heated argument, I am okay with being proven wrong and/or change my view based on what my opponent has said.' },
    { key: 'healthyLiving', label: 'Healthy living is important to me.' },
    { key: 'actionsOverWords', label: 'I believe actions speak louder than words.' },
    { key: 'passionateAboutPolitics', label: 'I am passionate about talking about politics' },
    { key: 'sharedMoralsImportant', label: "It's important for my partner to share the same morals as me." },
    { key: 'romantic', label: 'I am a romantic.' },
    { key: 'stemOverHumanities', label: 'I am more interested in STEM subjects than humanities.' },
];

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string

export const questionnaireService = {
    async submit(data: QuestionnaireData, userId: string) {
        try {
            return await database.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    ...data,
                    userId,
                    createdAt: new Date().toISOString(),
                }
            );
        } catch (error) {
            console.error('Error submitting questionnaire:', error);
            throw error;
        }
    },

    async getSubmission(userId: string) {
        try {
            const response = await database.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    // Query to find submission by userId
                    // Add index for userId in Appwrite console
                    Query.equal('userId', userId)
                ]
            );
            return response.documents[0];
        } catch (error) {
            console.error('Error fetching questionnaire:', error);
            throw error;
        }
    },
};