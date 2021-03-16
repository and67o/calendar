import {useDispatch} from "react-redux";
import {register} from "../../redux/auth-page";
import {useFormik} from "formik";
import React from "react";
import {Button, Input} from "antd";
import 'antd/dist/antd.css';

export const RegisterForm = () => {

    const dispatch = useDispatch()
    const submit = (values: any) => {
        const {password, login} = values
        dispatch(register(login, password))
    }

    const formik = useFormik({
        initialValues: {
            login: '',
            password: ''
        },
        onSubmit: values => {
            submit(values)
        }
    })

    return (
        <div className="form">
            <form className="form__register" onSubmit={formik.handleSubmit}>
                <label htmlFor="login">Логин</label>
                <Input id="login"
                       name="login"
                       type="text"
                       onChange={formik.handleChange}
                       value={formik.values.login}/>
                <label htmlFor="password">Пароль</label>
                <Input id="password"
                       name="password"
                       type="text"
                       onChange={formik.handleChange}
                       value={formik.values.password}/>
                <Button>Регистрация</Button>
            </form>
        </div>
    )
}