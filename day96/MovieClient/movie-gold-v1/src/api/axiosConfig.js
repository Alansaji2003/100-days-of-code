import { create } from '@mui/material/styles/createTransitions';
import axios from 'axios';


//for CORS - cross origin resourse sharing
export default axios.create({
    baseURL:"http://localhost:8080",
    headers:{"ngrok-skip-browser-warning":"true"}
})