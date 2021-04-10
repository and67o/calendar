import {instance} from './api'

export const userAPI = {
    auth(id: number) {
        return instance.get(`api/user/${id}`, {headers: {}})
            .then(res => res.data)
    },
    users() {
        return instance.get(`api/users`)
            .then(res => res.data.Data)
    }
}