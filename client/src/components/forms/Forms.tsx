import {useDispatch, useSelector} from "react-redux";
import {useFormik} from "formik";
import * as Yup from "yup";
import React, {useState} from "react";
import {Alert, Button, Input} from "antd";
import 'antd/dist/antd.css';
import {register} from "../../redux/auth-page";

export const FormComponent = () => {

    const dispatch = useDispatch()

    const sendRegister = (values:any) => {
        const {password, login} = values
        alert(`Идет запрос на регистрацию логин: ${login} и пароль: ${password}`)
        dispatch(register(login, password))
    }

    const sendAuthorization = (values:any) => {
        const {password, login} = values
        alert(`Идет запрос на авторизацию логин: ${login} и пароль: ${password}`)
        dispatch(register(login, password))
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
    } else return null


}

const RegisterForm: React.FC<any> = ({submit, formChange}) => {
    const formik = useFormik({
        initialValues: {
            login: '',
            password: ''
        },
        validationSchema: Yup.object({
            login: Yup.string()
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
            <label htmlFor="login">Логин</label>
            <Input id="login"
                   name="login"
                   type="text"
                   onChange={formik.handleChange}
                   value={formik.values.login}
                   {...formik.getFieldProps('login')}
            />
            {formik.touched.login && formik.errors.login ? <Alert message={formik.errors.login} type="error"/> : null}
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
            <Button size="large" type="primary" htmlType="submit">Регистрация</Button>
            <Button size="large" type="default" onClick={() => formChange("authorization")}>Войти</Button>
        </form>
    )
}

const AuthForm: React.FC<any> = ({submit, formChange}) => {
    const formik = useFormik({
        initialValues: {
            login: '',
            password: ''
        },
        validationSchema: Yup.object({
            login: Yup.string()
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
            <label htmlFor="login">Логин</label>
            <Input id="login"
                   name="login"
                   type="text"
                   onChange={formik.handleChange}
                   value={formik.values.login}
                   {...formik.getFieldProps('login')}
            />
            {formik.touched.login && formik.errors.login ? <Alert message={formik.errors.login} type="error"/> : null}
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
            <Button size="large" type="default" onClick={() => formChange("register")}>Регистрация</Button>
        </form>
    )
}