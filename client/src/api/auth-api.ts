import {instance} from './api'

export const authAPI = {
    register(data: any) {
        return instance.post(`api/register`, data)
            .then(res => res.data)
    },
    login(data: any) {
        return instance.post(`api/login`, data)
            .then(res => res.data)
    },
    auth() {
        return instance.post(`api/auth`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            }
        })
            .then(res => res.data)
    }
}