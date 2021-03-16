import React from "react";
import {useSelector} from "react-redux";
import {getCheckServer} from "../redux/app-selector";

const ServerStatus= () => {

    const checkServer = useSelector(getCheckServer)

    if(checkServer) {
        return (
            <div style={{background: "#afd4a0"}}>
                Сервер подключен
            </div>
        )
    } else {
        return (
            <div style={{background: "red"}}>
                Сервер не работает
            </div>
        )
    }

}

export default ServerStatus