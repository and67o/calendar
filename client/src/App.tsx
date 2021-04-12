import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getIsInitialize} from "./redux/app-selector";
import {FormComponentContainer} from "./components/forms/Forms";
import CalendarComponent from "./components/calendar/Calendar";
import Preloader from "./components/prelodaer/Preloader";
import Header from "./components/header/Header";
import {getDataUser} from "./redux/auth-selector";
import {checkAuth} from "./redux/auth-page";

const App = () => {

    const isInitialize = useSelector(getIsInitialize)
    const dataUser = useSelector(getDataUser)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(checkAuth())
    },[])

    if (isInitialize) {
        return (
            <div className="wrapper">
                <Header/>
                {dataUser.auth ? <DataUser login={dataUser.login}/> : <FormComponentContainer/>}
                <CalendarComponent auth={dataUser.auth}/>
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

const DataUser:React.FC<any> = ({login}) => {
    return(
        <div className="description">
            Здравствуйте <a>{login}</a> здесь вы можете посмтореть ближайшие праздники, добавить праздники.
        </div>
    )
}