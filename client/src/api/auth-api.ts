import {instance} from './api'

export const authAPI = {
    register(login: string | null, password: string | null) {
        return instance.post(`api/register`, {login, password})
            .then(res => res.data)
    },
    auth() {
        return instance.post(`api/auth`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.token}`
            }
        })
            .then(res => res.data)
    }
}