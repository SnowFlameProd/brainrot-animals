import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useFormik} from "formik";
import * as Yup from "yup";
import {loginUser, signupUser} from "@/services/manageData.ts";  // Импортируем Yup для валидации

const SignupForm = () => {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const validationSchema = Yup.object({
        username: Yup.string()
            .min(3, t('error.limited'))
            .max(20, t('error.limited'))
            .required(t('error.required')),
        password: Yup.string()
            .min(6, t('error.limitedPassword'))
            .required(t('error.required')),
        passwordConfirm: Yup.string()
            .min(6, t('error.limitedPassword'))
            .required(t('error.required'))
            .oneOf([Yup.ref('password')], t('error.passwordMatch')),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            passwordConfirm: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                const data = await signupUser(values.username, values.password);
                localStorage.setItem('authToken', data.token);
            } catch (error: any) {
                setError(error.response.data.message || "");
            } finally {
                setIsSubmitting(false);
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
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-left text-sm">{formik.errors.password}</div>
                ) : null}
            </div>
            <div className="mb-6">
                <Label className="mb-2" htmlFor="passwordConfirm">{t('form.passwordConfirm')}</Label>
                <Input
                    id="passwordConfirm"
                    type="password"
                    value={formik.values.passwordConfirm}
                    onChange={formik.handleChange}
                />
                {formik.touched.passwordConfirm && formik.errors.passwordConfirm ? (
                    <div className="text-red-500 text-left text-sm">{formik.errors.passwordConfirm}</div>
                ) : null}
            </div>

            {error && <div className="text-red-500 text-left text-sm mb-6">{error}</div>}

            <Button disabled={isSubmitting} className="w-full cursor-pointer" type="submit">{t('form.signup')}</Button>
        </form>
    );
}

export default SignupForm;