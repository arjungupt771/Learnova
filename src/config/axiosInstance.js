
import axios from "axios";

const DEFAULT_API_BASE_URL = "http://localhost:5014/api/v1";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const axiosInstance = axios.create({
    baseURL: (configuredBaseUrl || DEFAULT_API_BASE_URL).replace(/\/+$/, ""),
    withCredentials: true,
    headers: {
        Accept: "application/json",
    },
});

export default axiosInstance;
