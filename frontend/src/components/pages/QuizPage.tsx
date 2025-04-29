import React, {useEffect, useState} from "react";
import {getQuestions} from "@/services/manageData.ts";
import Header from "@/components/Header.tsx";

const QuizPage = () => {
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const response = await getQuestions();
            console.log(response.data);
        }

        fetch();
    }, []);

    return (
        <>
            <Header/>
            <div className="w-screen h-screen">
                <div className="bg-gradient-to-br from-blue-500 to-gray-300 w-full h-full">

                </div>
            </div>
        </>
    );
}

export default QuizPage;