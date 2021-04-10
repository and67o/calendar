import {useDispatch, useSelector} from "react-redux";
import {useFormik} from "formik";
import * as Yup from "yup";
import React, {useState} from "react";
import {Alert, Button, Input} from "antd";
import 'antd/dist/antd.css';
import {loginThunk, registerThunk} from "../../redux/auth-page";
import {getInit} from "../../redux/auth-selector";
import Preloader from "../prelodaer/Preloader";

export const FormComponentContainer = () => {

    const init = useSelector(getInit)

    if (init == false) {
        return (
            <div>
                <Forms/>
            </div>
        )
    } else {
        return (
            <Preloader/>
        )
    }
}

const Forms: React.FC<any> = () => {

    const dispatch = useDispatch()

    const sendRegister = (values: any) => {
        const {password, email, firstname, lastname} = values
        dispatch(registerThunk(email, password,  firstname, lastname))
    }

    const sendAuthorization = (values: any) => {
        const {password, email} = values
        dispatch(loginThunk(email, password))
    }

    const [form, setForm] = useState("register")

    if (form == "register") {
        return (
            <div className="form">
                <RegisterForm submit={sendRegister} formChange={setForm}/>
            </div>
        )
    } else if (form == "authorization") {
        return (
            <div className="form">
                <AuthForm submit={sendAuthorization} formChange={setForm}/>
            </div>
        )
    } else {
    }
}

const RegisterForm: React.FC<any> = ({submit, formChange}) => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            firstname: '',
            lastname: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required('Required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Required'),
        }),
        onSubmit: values => {
            submit(values)
        },
    })
    return (
        <form className="form__register" onSubmit={formik.handleSubmit}>
            <div>Если вы уже зарегистрированы воспользуйтесь формой входа<Button size="large" type="default"
                                                                                 onClick={() => formChange("authorization")}>Войти</Button>
            </div>
            <label htmlFor="email">Логин</label>
            <Input id="email"
                   name="email"
                   type="email"
                   onChange={formik.handleChange}
                   value={formik.values.email}
                   {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email ? <Alert message={formik.errors.email} type="error"/> : null}
            <label htmlFor="password">Пароль</label>
            <Input.Password id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password ? <Alert message={formik.errors.password} type="error"/> : null}
            <label htmlFor="firstname">Имя</label>
            <Input id="firstname"
                   name="firstname"
                   type="text"
                   onChange={formik.handleChange}
                   value={formik.values.firstname}
                   {...formik.getFieldProps('firstname')}
            />
            <label htmlFor="lastname">Фамилия</label>
            <Input id="lastname"
                   name="lastname"
                   type="text"
                   onChange={formik.handleChange}
                   value={formik.values.lastname}
                   {...formik.getFieldProps('lastname')}
            />
            <Button size="large" type="primary" htmlType="submit">Регистрация</Button>
        </form>
    )
}

const AuthForm: React.FC<any> = ({submit, formChange}) => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required('Required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Required'),
        }),
        onSubmit: values => {
            submit(values)
        },
    })
    return (
        <form className="form__register" onSubmit={formik.handleSubmit}>
            <div>Если вы еще не зарегистрированы то воспользуйтесь формой регистрации<Button size="large" type="default"
                                                                                             onClick={() => formChange("register")}>Регистрация</Button>
            </div>
            <label htmlFor="email">Email</label>
            <Input id="email"
                   name="email"
                   type="email"
                   onChange={formik.handleChange}
                   value={formik.values.email}
                   {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email ? <Alert message={formik.errors.email} type="error"/> : null}
            <label htmlFor="password">Пароль</label>
            <Input.Password id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password ?
                <Alert message={formik.errors.password} type="error"/> : null}
            <Button size="large" type="primary" htmlType="submit">Авторизация</Button>
        </form>
    )
}