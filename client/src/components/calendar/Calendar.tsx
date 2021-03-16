import React from 'react';
import 'antd/dist/antd.css';
import { Calendar, Badge } from 'antd';
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import {useSelector} from "react-redux";
import {getHolidays} from "../../redux/calendar-selector";

const CalendarComponent = () => {

    const listHappy = useSelector(getHolidays)

    return (
        <div className="calendar">
            <ul className="calendar__list">
                {/*{listHappy.map((item:any, index:any) => {*/}
                {/*    return <li key={index}>{item.content} дата:{item.day} </li>*/}
                {/*})}*/}
                После регистрации\логинизации здесь будут события за текущий месяц
            </ul>
            <Calendar dateCellRender={dateCellRender} locale={locale}/>
        </div>
    )
}

export default CalendarComponent

const dateCellRender = (value:any) => {

    const listHappy = useSelector(getHolidays)

    let happy:any = []

    for (let item of listHappy) {
        if (value.date() == item.day && value.month() == item.month) {
            happy.push(item)
        }
    }

    return (
        <ul className="events">
            {/*{happy.map((item:any, index:any) => (*/}
            {/*    <li key={index}>*/}
            {/*        <Badge status={item.type} text={item.content} />*/}
            {/*    </li>*/}
            {/*))}*/}
        </ul>
    );
}