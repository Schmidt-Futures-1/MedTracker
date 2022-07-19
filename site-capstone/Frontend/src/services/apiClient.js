import { API_BASE_URL } from "../constants";
import axios from "axios";

class ApiClient {
    constructor(remoteHostUrl) {
        this.remoteHostUrl = remoteHostUrl;
    }

    async request({ endpoint, method=`GET`, data={}}) {
        const url = `${this.remoteHostUrl}/${endpoint}`;

        const headers = {
            "Content-Type": "application/json"
        }

        try {
            const res = await axios({url, method, data, headers});
            return {data: res.data, error: null};
        }catch(error) {
            console.error({ errorResponse: error.response})
            const message = error?.response?.data?.error?.message;
            return {data: null, error: message || String(error)};
        }
    }

    async login(credentials) {
        return await this.request({ endpoint: `auth/login`, method: `POST`, data: credentials});
    }

    async signup(credentials) {
        return await this.request({ endpoint: `auth/register`, method: `POST`, data: credentials});
    }

}

export default new ApiClient(API_BASE_URL);