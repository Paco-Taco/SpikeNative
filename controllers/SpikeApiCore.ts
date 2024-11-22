import axios from "axios";

export const axiosInstanceSpikeCore = axios.create({
  baseURL: "https://api-spike-jet.vercel.app/",
  timeout: 100000,
});
