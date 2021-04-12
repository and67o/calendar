import React from "react";
import {useSelector} from "react-redux";
import {getCheckServer} from "../redux/app-selector";

const ServerStatus = () => {

    const checkServer = useSelector(getCheckServer)

    return (
        <div>
            {checkServer ? <div style={{background: "#afd4a0"}}>Сервер подключен</div>
                         : <div style={{background: "red"}}>Сервер не работает</div>}
        </div>
    )
}

export default ServerStatus