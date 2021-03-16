import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getCheckServer, getIsInitialize, getTestMessage} from "./redux/app-selector";
import {actionsApp, getCheckTestServer} from "./redux/app";
import {RegisterForm} from "./components/forms/Forms";
import CalendarComponent from "./components/calendar/Calendar";
import Preloader from "./components/prelodaer/Preloader";
import Header from "./components/header/Header";

const App = () => {

    const isInitialize = useSelector(getIsInitialize)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(actionsApp.setInitialize(true))
    }, [])
    useEffect(() => {
        dispatch(getCheckTestServer())
    }, [])

    if (isInitialize) {
        return (
            <div className="wrapper">
                <Header/>
                <RegisterForm/>
                <CalendarComponent/>
            </div>
        )
    } else {
        return (
            <div>
                <Preloader/>
            </div>
        )
    }
}

export default App;

