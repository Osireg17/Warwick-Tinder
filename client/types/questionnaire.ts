export interface LikertOption {
    value: number;
    label: string;
}

export interface LikertQuestion {
    key: string;
    label: string;
}

export interface QuestionnaireData {
    studentId: string;
    identity: string;
    preferredDate: string;
    yearOfStudy: string;
    yearPreference: string;
    dateType: string;
    partnerPreference: string;
    dateFormat: string;
    [key: string]: string;
}