import axios from "axios";

const BASE_URL =
  "https://afrolay-server-c9bb6c205b41.herokuapp.com/api/v1";

// const BASE_URL = "http://localhost:8000/api/v1";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
