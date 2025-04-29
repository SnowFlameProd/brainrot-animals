import React, {useContext} from 'react';
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button.tsx";
import AuthContext from "@/contexts/AuthContext.tsx";

const Header = () => {
    const { t } = useTranslation();
    const { user, logOut } = useContext(AuthContext)!;

    return (
        <div className="w-full h-20 bg-blue-50 absolute shadow-sm flex items-center justify-between px-12">
            <h3 className="font-bold text-2xl">{t('header.title')}</h3>
            <div className="flex items-center gap-4 text-lg">
                <div>{user?.username}</div>
                <Button onClick={() => logOut()} className="cursor-pointer">{t('header.logout')}</Button>
            </div>
        </div>
    );
};

export default Header;