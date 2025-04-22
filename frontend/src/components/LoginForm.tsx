import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useFormik} from "formik";
import * as Yup from "yup";
import {loginUser} from "@/services/manageData.ts";
import routes from "@/routes/routes.ts";  // Импортируем Yup для валидации

const LoginForm = () => {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);

    const validationSchema = Yup.object({
        username: Yup.string().required(t('form.usernameReq')),
        password: Yup.string().required(t('form.passwordReq')),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await loginUser(values.username, values.password);
                console.log(response);
                localStorage.setItem('authToken', response.data.token);
            } catch (error: any) {
                setError(error.response.data.message || "");
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="w-100 p-6 border rounded-md">
            <div className="mb-6">
                <Label className="mb-2" htmlFor="username">{t('form.username')}</Label>
                <Input
                    id="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    required
                />
                {formik.touched.username && formik.errors.username ? (
                    <div className="text-red-500 text-left text-sm">{formik.errors.username}</div>
                ) : null}
            </div>
            <div className="mb-6">
                <Label className="mb-2" htmlFor="password">{t('form.password')}</Label>
                <Input
                    id="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    required
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-left text-sm">{formik.errors.password}</div>
                ) : null}
            </div>

            {error && <div className="text-red-500 text-left text-sm mb-6">{error}</div>}

            <Button className="w-full cursor-pointer" type="submit">{t('form.login')}</Button>

            <p className="mt-6 text-sm/6 text-primary">
                {t('form.noAccount')}
                <a href={routes.signup} className="font-semibold text-indigo-500 hover:text-indigo-600">{t('form.signup')}</a>
            </p>
        </form>
    );
}

export default LoginForm;