const { default: axios } = require("axios");

export const BASE_URL = "https://linkedin-clone-t0xj.onrender.com"

export const clientServer = axios.create({
    baseURL: BASE_URL,
});