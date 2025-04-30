export interface Question {
    label: string;
    options: {
        isCorrect: boolean;
        image_url: string;
        sound_url: string;
    }[];
}