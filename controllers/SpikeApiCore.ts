import axios from "axios";

export const axiosInstanceSpikeCore = axios.create({
  baseURL: "https://api-spike-phi.vercel.app/",
  timeout: 100000,
});
