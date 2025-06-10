import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ParticipantJoinBar({ sideText }) {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const handlePollJoin = () => {
    if (!code) {
      toast.info("Please enter a code to join the poll.");
      return;
    }

    if (code.length !== 6) {
      toast.info("Code must be 6 characters long.");
      return;
    }

    if (!/^\d+$/.test(code)) {
      toast.info("Code must contain only numbers.");
      return;
    }

    navigate(`/poll/vote/${code}`);
  };

  return (
    <div className="m-auto flex flex-col sm:flex-row items-center justify-center gap-3 bg-white text-primary sm:rounded-full rounded-xl p-5 sm:p-1 w-[90%] sm:w-fit max-w-full shadow-md">
      {sideText && (
        <span className="text-xl font-bold px-2 sm:pl-4 text-center sm:text-left">
          {sideText}
        </span>
      )}

      <div className="flex justify-between items-center bg-primary text-white rounded-xl sm:rounded-full sm:pr-1 sm:pl-3 px-3 py-2 w-fit sm:w-72 max-w-[300px]">
        <>
          <span className="text-white/70 mr-2 text-base max-sm:ml-2 sm:text-lg font-bold">#</span>

          <input
            type="text"
            placeholder="Enter code here"
            className="flex-grow bg-transparent outline-none text-sm max-sm:p-1 w-fit sm:text-md font-semibold placeholder-white/90"
            onChange={(e) => setCode(e.target.value)}
            value={code}
          />
        </>

        <button
          className="sm:ml-4 bg-white text-primary p-1 rounded-lg sm:rounded-full hover:bg-gray-100 hover:cursor-pointer transition"
          onClick={handlePollJoin}
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
