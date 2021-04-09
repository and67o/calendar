import {instance} from './api'

export const userAPI = {
    auth(id:number) {
        return instance.get(`api/user/${id}`,{
            headers: {
                // Authorization: `Bearer ${localStorage.token}`,
            }
        })
            .then(res => res.data)
    }
}