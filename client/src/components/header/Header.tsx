import React from "react";
import ServerStatus from "../ServerStatus";
import {useDispatch, useSelector} from "react-redux";
import {getDataUser} from "../../redux/auth-selector";
import {logoutThunk} from "../../redux/auth-page";

const Header = () => {

    const dispatch = useDispatch()

    const logout = () => dispatch(logoutThunk())

    const data = useSelector(getDataUser)

    return (
        <div className="header">
            <p>Календарь сотрудника</p>
            {data.auth ? <div className="login">{data.login} <button onClick={() => logout()}>logout</button></div> : null}
            <ServerStatus/>
        </div>
    )
}

export default Header