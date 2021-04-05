import React from "react";
import ServerStatus from "../ServerStatus";
import {useSelector} from "react-redux";
import {getDataUser} from "../../redux/auth-selector";

const Header = () => {

    const data = useSelector(getDataUser)

    return (
        <div className="header">
            <p>Календарь сотрудника</p>
            {data.auth ? <div className="login">{data.login}</div> : null}
            <ServerStatus/>
        </div>
    )
}

export default Header