import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getIsInitialize, getTestMessage} from "./redux/app-selector";
import {actionsApp, getCheckTestServer} from "./redux/app";
import {RegisterForm} from "./components/Forms";
import CalendarComponent from "./components/calendar/Calendar";

const App = () => {

    const isInitialize = useSelector(getIsInitialize)
    const testMessage = useSelector(getTestMessage)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(actionsApp.setInitialize(true))
    })
    useEffect(() => {
        dispatch(getCheckTestServer())
    })

    if (isInitialize) {
        return (
            <div>
                Инициализация прошла
                <TestMessage test={testMessage}/>
                <RegisterForm/>
                <CalendarComponent/>
            </div>
        )
    } else {
        return (
            <div>
                Идет инициализация
            </div>
        )
    }
}

export default App;


const TestMessage: React.FC<any> = ({test}) => {
    return (
        <div>
            {test}
        </div>
    )
}

