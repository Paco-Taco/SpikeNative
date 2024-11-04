import axios from "axios";

export const axiosInstanceSpikeCore = axios.create({
  baseURL: "https://api-spikeapp.vercel.app/",
  timeout: 10000,
});
