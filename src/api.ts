import axios from "axios";

axios.defaults.baseURL = "https://stamping-tool-backend.onrender.com";

export function getStampsImages() {
  return axios.get("/stamps");
}