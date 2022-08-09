import { signOut } from "./store/loginSlice/reducer";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function setupAxios(axios, store) {

    axios.defaults.baseURL = BASE_URL;

    axios.defaults.withCredentials = true;

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            if (error.response.status === 401) {
                await store.dispatch(signOut(error.response.data.message))
            }
            return Promise.reject(error);
        }
    );

}