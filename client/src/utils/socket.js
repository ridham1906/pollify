import { io } from "socket.io-client";
import {toast} from 'react-toastify'

const SOCKET_URL = import.meta.env.VITE_SERVER_API.replace('/api', '');

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

socket.on("success",(data)=>{
    const{msg, status} = data;

    if(status == "success"){
        toast.success(msg);
    }
})

socket.on("error", (data)=> {
    const{ type, msg } = data;
    toast.error(`${type} : ${msg}`);
    
})

export {socket};