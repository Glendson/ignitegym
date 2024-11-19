import axios from "axios";
import { AppError } from "../utils/AppError";

const api = axios.create({
  baseURL: "http://192.168.1.2:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(new AppError(error.resposne.data.message));
    } else {
        return Promise.reject(error);
    }
  }
);

export { api };
