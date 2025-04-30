import React, {useEffect, useRef, useState} from 'react';
import {getQuestions} from "@/services/manageData.ts";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import {Question} from "@/interfaces/Question.ts";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { API_URL } from "@/config/api";

const Quiz = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [revealed, setRevealed] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const fetch = async () => {
            const response = await getQuestions();
            console.log(response.data);
            setQuestions(response.data);
        }

        fetch();
    }, []);

    useEffect(() => {
        if (questions.length === 0 || revealed) return;

        timerRef.current = setTimeout(() => {
            handleReveal(null); // reveal without selection
        }, 5000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentSlide, revealed, questions]);

    const handleReveal = (index: number | null) => {
        setSelectedIndex(index);
        setRevealed(true);

        const correctSound = new Audio(
            `${API_URL}${questions[currentSlide].options.find(o => o.isCorrect)?.sound_url}` || ""
        );

        audioRef.current = correctSound;

        correctSound.play();
    };

    const handleNextQuestion = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // Сбрасываем на начало
        }

        if (currentSlide < questions.length - 1) {
            setCurrentSlide(currentSlide + 1);
            setSelectedIndex(null);
            setRevealed(false);
        } else {
            // TODO: показать финальный экран или завершить викторину
        }
    }


    return (
        <div className="h-140 w-120 bg-blue-50 rounded-lg shadow-lg flex items-center justify-center">
            {
                isStarted ?
                <div>
                    <Carousel className="w-full max-w-2xl mx-auto" opts={{ loop: false }}>
                        <CarouselContent style={{ transform: `translateX(-${currentSlide * 100}%)`, transition: "transform 0.3s" }}>
                            {questions.map((question, qIndex) => (
                                <CarouselItem key={qIndex} className="p-4 w-full shrink-0 grow-0 basis-full">
                                    <div className="text-xl font-bold mb-4 text-center">Кто из них {question.label}?</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {question.options.map((option, i) => {
                                            const isSelected = selectedIndex === i;
                                            const isCorrect = option.isCorrect;
                                            const shouldShowBorder = revealed && (isSelected || isCorrect);

                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => !revealed && handleReveal(i)}
                                                    className={cn(
                                                        "cursor-pointer rounded-xl overflow-hidden border-4 transition-shadow duration-300",
                                                        {
                                                            "border-green-500 shadow-green-400 shadow-lg": revealed && isCorrect,
                                                            "border-red-500 shadow-red-400 shadow-lg": revealed && isSelected && !isCorrect,
                                                            "border-transparent": !shouldShowBorder,
                                                        }
                                                    )}
                                                >
                                                    <img src={`${API_URL}${option.image_url}`} alt="" className="w-full h-40 object-cover" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {revealed && <Button className="cursor-pointer" onClick={() => handleNextQuestion()}>{t('quiz.continue')}</Button>}
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div> :
                <Button className="cursor-pointer text-xl py-4 h-12" size="lg" onClick={() => setIsStarted(true)}>{t('quiz.start')}</Button>
            }
        </div>
    );
};

export default Quiz;