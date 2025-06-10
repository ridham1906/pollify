import axios from "axios";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { Circle } from 'lucide-react';
import { Link } from "react-router-dom";

export default function AllPolls(){
    const [polls, setPolls] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(()=> {
        fetchAllPolls();
        let user = JSON.parse(localStorage.getItem('user'));
        if(user){
            setUser(user);
        }
    },[])

    const fetchAllPolls = async()=>{
        let token = localStorage.getItem('token')
        try{
            let res = await axios.get(`${import.meta.env.VITE_SERVER_API}/polls/admin/all`,{
                headers:{
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            if(res.status == 200){
                setPolls(res.data.polls);
            }
            
        }catch(err){
            toast.error(err.response.data.msg)
        }
    }

    return(
        <>
            {polls.length===0 && user?
                (<div className="mt-10 text-center">
                    <p className="text-3xl text-gray-700 font-bold italic">{user!=null ?"You not created any polls yet !" : "Unauthorized! access denied"}</p>
                </div>) :
                
                (<div className="mt-1 p-2">
                    {polls.map((poll, idx)=> (
                        <Link to={`/poll/view/${poll.sessionCode}`}  key={idx}><PollCard poll={poll}/></Link>
                    ))}
                </div>)
            }
        </>
    )
}


export const PollCard = ({ poll }) => {
    return (
        <div className="bg-white shadow-md rounded-lg px-5 py-2 mb-2 border hover:shadow-lg hover:cursor-pointer transition flex flex-col gap-2">
            <div className="text-lg font-bold text-primary flex justify-between">
                <p>{poll.question}</p>
                <p> # {poll.sessionCode} </p>
            </div>
            <div className="text-sm flex justify-between">
               <p> Expires: {poll.expiresAt ? new Date(poll.expiresAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true }) : "No expiry"}</p>

            <p title={poll.status=="expired" ? "Expired": "Active"}> {<Circle fill={poll.status=="expired" ? "red" : "green" } /> } </p>
            </div>

        </div>
    );
}