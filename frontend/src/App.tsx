import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import './App.css'
import './i18n/config';
import routes from './routes/routes';
import LoginPage from '@/components/pages/LoginPage'
import QuizPage from '@/components/pages/QuizPage'
import SignupPage from "@/components/pages/SignupPage";
import useAuth from "@/hooks/useAuth";
import Spinner from "@/components/ui/spinner.tsx";

const App = () => {
    const { isAuthenticated, loading } = useAuth();

    const checkAuth = () => (isAuthenticated ? <QuizPage /> : <Navigate to={routes.login} />);

    if (loading) {
        return <Spinner></Spinner>;
    }

    return (
        <>
            <Router>
                <Routes>
                    <Route path={routes.root} element={checkAuth()}/>
                    <Route path={routes.login} element={<LoginPage />}/>
                    <Route path={routes.signup} element={<SignupPage />}/>
                </Routes>
            </Router>
        </>
  )
}

export default App
