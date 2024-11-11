import axios from "axios";

export const axiosInstanceSpikeCore = axios.create({
  baseURL: "https://api-spike-martinfits-projects.vercel.app/",
  timeout: 100000,
});
