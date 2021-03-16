import React from "react";
import ServerStatus from "../ServerStatus";

const Header = () => {
    return (
        <div className="header">
            <p>Календарь сотрудника</p>
            <ServerStatus/>
        </div>
    )
}

export default Header