import axios from "axios"
import { BASE_URL } from "../constant"

const request = axios.create({
    baseURL: BASE_URL,
    timeout: 3000,
    headers: {
        "Content-Type": "application/json",
    },
})

request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("refresh_token") || ""
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default () => request.get("logIn/getUserInformationAndNewAccessToken")
