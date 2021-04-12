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

    return (!init) ? <Forms/> : <Preloader/>
}

const Forms: React.FC<any> = () => {

    const dispatch = useDispatch()

    const sendRegister = (values: RegisterFormValueType) => dispatch(registerThunk(values.email, values.password, values.firstname, values.lastname))

    const sendAuthorization = (values: AuthFormValueType) => dispatch(loginThunk(values.email, values.password))

    const [form, setForm] = useState("register")

    return (form === "register") ? <div className="form"><RegisterForm submit={sendRegister} formChange={setForm}/></div>
                                 : <div className="form"><AuthForm submit={sendAuthorization} formChange={setForm}/></div>
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
                .email('Введите почту полностью!')
                .required('Обязательное поле'),
            password: Yup.string()
                .min(6, 'Пароль должен содержеть не менее 6 символов')
                .required('Обязательное поле'),
            firstname: Yup.string()
                .required('Обязательное поле'),
            lastname: Yup.string()
                .required('Обязательное поле'),
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
            <label htmlFor="email">Почта</label>
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
            <label htmlFor="firstname">Имя</label>
            <Input id="firstname"
                   name="firstname"
                   type="text"
                   onChange={formik.handleChange}
                   value={formik.values.firstname}
                   {...formik.getFieldProps('firstname')}
            />
            {formik.touched.firstname && formik.errors.firstname ? <Alert message={formik.errors.firstname} type="error"/> : null}
            <label htmlFor="lastname">Фамилия</label>
            <Input id="lastname"
                   name="lastname"
                   type="text"
                   onChange={formik.handleChange}
                   value={formik.values.lastname}
                   {...formik.getFieldProps('lastname')}
            />
            {formik.touched.lastname && formik.errors.lastname ? <Alert message={formik.errors.lastname} type="error"/> : null}
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

export const HolidayAddForm:React.FC<HolidayAddFormPropsType> = ({day}) => {

    const formik = useFormik({
        initialValues: {
            content: ''
        },
        onSubmit: values => {
            console.log(`${day} описание праздник: ${values.content}`)
            console.log(day)
        }
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="content">Оисание праздника</label>
            <Input id="content"
                   name="content"
                   type="text"
                   onChange={formik.handleChange}
                   value={formik.values.content}
                   {...formik.getFieldProps('content')}
            />
            <Button size="large" type="primary" htmlType="submit">Добавить праздник</Button>
        </form>
    )
}

type RegisterFormValueType = {
    password: string,
    email: string,
    firstname: string
    lastname: string
}
type AuthFormValueType = {
    password: string,
    email: string,
}
type HolidayAddFormPropsType = {
    day: string,
}