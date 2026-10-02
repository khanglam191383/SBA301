import axios from "axios";

const apiClient = axios.create({
    timeout: 5000,
    headers: {
        Accept: "application/json",
    },
});

export default apiClient;