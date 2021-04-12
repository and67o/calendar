import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Calendar, Badge} from 'antd';
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import {useDispatch, useSelector} from "react-redux";
import {getHolidays} from "../../redux/calendar-selector";
import {getDataUser} from "../../redux/auth-selector";
import {getUsersThunk} from "../../redux/users-page";
import {getUsers} from "../../redux/users-selector";
import {getDataDay} from "../../redux/calendar-page";
import {FormComponentContainer, HolidayAddForm} from "../forms/Forms";

const CalendarComponent: React.FC<CalendarComponentPropsValueType> = ({auth}) => {

    const happyList = useSelector(getHolidays)
    const items = 2

    const [dayItemData, setDayItemData] = useState("день не выбран")

    const onClickDay = (items: any, value: any) => {
        setDayItemData(`Дата: ${value._d}`)
    }

    return (
        <div className="calendar">
            {auth ? <LeftListsComponents happyList={happyList}/> : null}
            <Calendar onSelect={(value) => onClickDay(items, value)} dateCellRender={dateCellRender} locale={locale}/>
            {auth ? <DayItemComponent day={dayItemData}/> : null}
        </div>
    )
}

const dateCellRender = (value: any) => {

    const listHappy = useSelector(getHolidays)

    let happy: any = []

    for (let item of listHappy) {
        if (value.date() == item.day && value.month() == item.month) {
            happy.push(item)
        }
    }

    return (
        <ul className="events">
            {happy.map((item: any, index: any) => (
                <li key={index}>
                    <Badge status={item.type} text={item.content}/>
                </li>
            ))}
        </ul>
    );
}

const FriendComponent: React.FC<any> = () => {

    const auth = useSelector(getDataUser).auth

    return <div> {auth ? <FriendList/> : <div>пока что вы не авторизованы</div>}</div>
}

const FriendList: React.FC<any> = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUsersThunk())
    }, [])

    const users = useSelector(getUsers)

    return <div> {users.length > 0 ? <FriendsItems users={users}/> : <div>ничего нет</div>} </div>

}

const FriendsItems: React.FC<any> = ({users}) => users.map((item: any, index: number) => <FriendItem key={index}
                                                                                                     email={item.email}
                                                                                                     firstname={item.firstname}
                                                                                                     lastname={item.lastname}/>)

const FriendItem: React.FC<any> = ({email, firstname, lastname}) => <div>{email} ({firstname} {lastname})</div>

const DayItemComponent: React.FC<DayItemComponentPropsValueType> = ({day}) => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getDataDay(day))
    }, [day])

    return (
        <div>
            <div>{day}</div>
            <HolidayAddForm day={day}/>
        </div>
    )
}

const HappyItem: React.FC<HappyItemPropsValueType> = ({content, day}) => {
    return (
        <li>{content} <strong>дата: {day}</strong></li>
    )
}

const LeftListsComponents: React.FC<LeftListsComponentsPropsValueType> = ({happyList}) => {

    return (
        <div>
            <ul className="calendar__list">{happyList.map((item: any, index: any) => <HappyItem key={index}
                                                                                                content={item.content}
                                                                                                day={item.day}/>)}</ul>
            <FriendComponent/>
        </div>
    )
}

export default CalendarComponent

type HappyItemPropsValueType = {
    content: string,
    day: string
}
type DayItemComponentPropsValueType = {
    day: string
}
type CalendarComponentPropsValueType = {
    auth: boolean
}
type LeftListsComponentsPropsValueType = {
    happyList: any[]
}