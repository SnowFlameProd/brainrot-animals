import React from "react";
import Header from "@/components/Header.tsx";
import Quiz from "@/components/Quiz.tsx";

const QuizPage = () => {

    return (
        <>
            <Header/>
            <div className="w-screen h-screen">
                <div className="bg-gradient-to-br from-blue-500 to-gray-300 w-full h-full flex items-center justify-center">
                    <Quiz/>
                </div>
            </div>
        </>
    );
}

export default QuizPage;