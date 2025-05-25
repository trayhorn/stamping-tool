import axios from "axios";

export const BASE_URL = "https://stamping-tool-backend.onrender.com";

axios.defaults.baseURL = BASE_URL;

export function getStampsImages() {
  return axios.get("/stamps");
}