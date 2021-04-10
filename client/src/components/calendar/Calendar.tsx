import React, {useEffect} from 'react';
import 'antd/dist/antd.css';
import {Calendar, Badge} from 'antd';
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import {useDispatch, useSelector} from "react-redux";
import {getHolidays} from "../../redux/calendar-selector";
import {getDataUser} from "../../redux/auth-selector";
import {getUsersThunk} from "../../redux/users-page";
import {getUsers} from "../../redux/users-selector";

const CalendarComponent = () => {

    const listHappy = useSelector(getHolidays)

    return (
        <div className="calendar">
            <div>
                <ul className="calendar__list">
                    {/*{listHappy.map((item:any, index:any) => {*/}
                    {/*    return <li key={index}>{item.content} дата:{item.day} </li>*/}
                    {/*})}*/}
                    После регистрации\логинизации здесь будут события за текущий месяц
                </ul>
                <FriendComponent/>
            </div>
            <Calendar dateCellRender={dateCellRender} locale={locale}/>
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
            {/*{happy.map((item:any, index:any) => (*/}
            {/*    <li key={index}>*/}
            {/*        <Badge status={item.type} text={item.content} />*/}
            {/*    </li>*/}
            {/*))}*/}
        </ul>
    );
}

const FriendComponent = () => {

    const auth = useSelector(getDataUser).auth

    return <div> {auth ? <FriendList/> : <div>пока что вы не авторизованы</div>}</div>
}

const FriendList: React.FC<any> = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUsersThunk())
    }, [])

    const users = useSelector(getUsers)

    return (
        <div>
            {users.length > 0 ? <FriendsItems users={users}/> : <div>ничего нет</div>}
        </div>
    )
}

const FriendsItems: React.FC<any> = ({users}) => {
    return (
        users.map((item: any, index: number) => {
            return <FriendItem key={index} email={item.email} />
        })
    )
}

const FriendItem: React.FC<any> = ({email}) => {
    return (
        <div>{email}</div>
    )
}

export default CalendarComponent