import axios from "axios";
import { toast } from "sonner";

const client = axios.create({
    baseURL: "/api",
});

client.interceptors.request.use(async (config) => {
    const token = await (window as any).Clerk?.session?.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

client.interceptors.response.use(
    response => response,
    error => {
        const message = error.response?.data?.detail ?? error.message ?? "Something went wrong";
        toast.error(message);
        return Promise.reject(error);
    }
);

export default client;