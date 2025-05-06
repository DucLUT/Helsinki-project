import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8080/api" : "/api";

export const axiosInstance = axios.create({
	baseURL: "http://localhost:8080/api",
	withCredentials: true,
});