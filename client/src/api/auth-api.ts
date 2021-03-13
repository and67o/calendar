import {instance} from './api'

export const authAPI = {
    register(login: string | null, password: string | null) {
        return instance.post(`api/auth`, {login, password})
            .then(res => res.data)
    }
}