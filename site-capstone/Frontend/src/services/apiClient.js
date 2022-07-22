import { API_BASE_URL } from "../../constants";
import axios from "axios";

class ApiClient {
    constructor(remoteHostUrl) {
        this.remoteHostUrl = remoteHostUrl;
        this.token = null
        this.tokenName = "medication_tracker_token"
    }

    setToken(token){
        this.token = token
        localStorage.setItem(this.tokenName, token)
    }

    async request({ endpoint, method=`GET`, data={}}) {
        const url = `${this.remoteHostUrl}/${endpoint}`;

        const headers = {
            "Content-Type": "application/json"
        }

          if (this.token){
            headers["Authorization"] = `Bearer ${this.token}`
        }

        try {
            const res = await axios({url, method, data, headers});
            return {data: res.data, error: null};
        }catch(error) {
            console.error({ errorResponse: error.response})
            const message = error?.response?.data?.error?.message;
            const status = error?.response?.data?.error?.status;
            return {data: null, error: message || String(error), errorStatus: status || 0};
        }
    }

    async login(credentials) {
        return await this.request({ endpoint: `auth/login`, method: `POST`, data: credentials});
    }

    async signup(credentials) {
        return await this.request({ endpoint: `auth/register`, method: `POST`, data: credentials});
    }

    async fetchUserFromToken() {
        return await this.request({ endpoint: `auth/me`, method: `GET` })
    }

    async logout() {
        this.setToken(null)
        localStorage.setItem(this.tokenName, "")
    }

    async createMedication(medication) {
        return await this.request({ endpoint: "medication", method:`POST`, data: medication} )
    }

    async fetchUserMedications() {
        return await this.request({ endpoint: `medication`, method: `GET` })
    }

    async fetchMedicationById(medicationId) {
        return await this.request({ endpoint: `medication/${medicationId}`, method: `GET` })
    }
}

export default new ApiClient(API_BASE_URL);