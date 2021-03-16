import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getCheckServer, getIsInitialize, getTestMessage} from "./redux/app-selector";
import {actionsApp, getCheckTestServer} from "./redux/app";
import {RegisterForm} from "./components/Forms";
import CalendarComponent from "./components/calendar/Calendar";
import Preloader from "./components/prelodaer/Preloader";

const App = () => {

    const isInitialize = useSelector(getIsInitialize)
    const testMessage = useSelector(getTestMessage)
    const checkServer = useSelector(getCheckServer)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(actionsApp.setInitialize(true))
    }, [])
    useEffect(() => {
        dispatch(getCheckTestServer())
    }, [])

    if (isInitialize) {
        return (
            <div>
                <TestMessage checkServer={checkServer} test={testMessage}/>
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


const TestMessage: React.FC<any> = ({test, checkServer}) => {

    let style

    if (checkServer) {
        style = {background: "green"}
    } else {
        style = {background: "red"}
    }

    return (
        <div style={style}>
            {test}
        </div>
    )
}

