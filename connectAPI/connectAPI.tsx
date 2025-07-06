import Constants from "expo-constants";
import axios from 'axios';
const { url_api, app_id } = Constants.expoConfig?.extra || {};



const CONAPI = axios.create({  
    baseURL: url_api,
    headers:{
        'app-id': app_id,
    }
})

export default CONAPI;
