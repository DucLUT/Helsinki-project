import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8080/api" : "/api";
console.log("BASE_URL", BASE_URL);
export const axiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
});