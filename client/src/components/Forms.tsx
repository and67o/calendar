import {useDispatch} from "react-redux";
import {register} from "../redux/auth-page";
import {useFormik} from "formik";
import React from "react";

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
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="login">Login</label>
            <input id="login"
                   name="login"
                   type="text"
                   onChange={formik.handleChange}
                   value={formik.values.login}/>
            <label htmlFor="password">Password</label>
            <input id="password"
                   name="password"
                   type="text"
                   onChange={formik.handleChange}
                   value={formik.values.password}/>
            <button type="submit">Регистрация</button>
        </form>
    )
}