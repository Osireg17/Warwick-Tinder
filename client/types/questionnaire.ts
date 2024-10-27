export interface LikertQuestion {
    key: string;
    label: string;
}

export interface LikertOption {
    value: string;
    label: string;
}

export interface QuestionnaireData {
    studentId: string;
    identity: string;
    preferredDate: string;
    yearOfStudy: string;
    partnerPreference: string;
    dateType: string;
    relationshipType: string;
    interestedIn: string;
    [key: string]: string;
}