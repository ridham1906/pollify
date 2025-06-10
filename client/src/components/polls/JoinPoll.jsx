import { X } from 'lucide-react'
import { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function JoinPoll({showPopUp, setShowPopUp}){

    const [ code, setCode] = useState('');

    const navigate = useNavigate();

    const handleSubmit = ()=> {
        if (!code) {
            toast.info("Please enter a code to join the poll.");
            return;
        }

        if (code.length < 6 || code.length > 6) {
            toast.info("Code must be 6 characters long.");
            return;
        }

        if (!/^\d+$/.test(code)) {
            toast.info("Code only contain numbers.");
            return;
        }
        setShowPopUp(false);
        navigate(`/poll/vote/${code}`);

    }

    return(
        <>
            {showPopUp &&
            
            <div className="inset-0 bg-gray-400/70 flex items-center justify-center z-50 absolute top-0">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4">
                    <div className="flex justify-between gap-5">
                        <h2 className="text-lg font-bold">Enter Session Code of Poll</h2>
                        <X
                            className="hover:cursor-pointer"
                            color="black"
                            size={"25px"}
                            onClick={()=> setShowPopUp(false)}
                        />
                    </div>

                    <div className='flex flex-col gap-4 items-center text-center'>
                        <input type="text" 
                            className='border-2b border-gray-200 w-full bg-gray-200 rounded-md p-2 font-bold text-center' 
                            placeholder='eg. 202556'
                            onChange={(e)=>setCode(e.target.value)}
                            value={code}
                        
                        />
                        
                        <button className="bg-primary text-white font-semibold w-full px-6 py-1 rounded cursor-pointer"
                            onClick={handleSubmit}>
                            Enter
                        </button>
                    </div>

                </div>
            </div> }
        </>
    )
}