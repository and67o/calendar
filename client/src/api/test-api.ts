import {instance} from './api'

export const testAPI = {
    check() {
        return instance.get(`api/hello`)
            .then(res => res.data)
    }
}