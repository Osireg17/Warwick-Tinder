export interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export interface EventDetail {
    icon: React.ComponentType<{ className?: string }>;
    text: string;
}