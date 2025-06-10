import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { socket } from "../utils/socket";
import { toast } from "react-toastify";
import { Circle } from "lucide-react";

export default function VotePage() {
    const { code } = useParams();
    const [poll, setPoll] = useState(null);
    const [voted, setVoted] = useState(false);
    const [selected, setSelected] = useState("");
    const [expired, setExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');
    const prevStatus = useRef(null);

    const saveVoteInStorage = (pollId, optId) => {
        let votes = JSON.parse(localStorage.getItem('voted-polls')) || {};
        votes[pollId] = optId;
        localStorage.setItem('voted-polls', JSON.stringify(votes));
    };

    const getPrevVote = (pollId) => {
        let votes = JSON.parse(localStorage.getItem('voted-polls')) || {};
        return votes[pollId] || null;
    };

    useEffect(() => {
        const getPoll = async () => {
            try {
                let res = await axios.get(`${import.meta.env.VITE_SERVER_API}/polls/${code}`);
                if (res.status === 200) {
                    const pollData = res.data.poll;
                    setPoll(pollData);
                    prevStatus.current = pollData.status;
                    socket.emit("join-session", code);

                    const prevOptId = getPrevVote(pollData._id);
                    if (prevOptId) {
                        setVoted(true);
                        setSelected(prevOptId);
                    }

                    if (pollData.status === "expired") {
                        setExpired(true);
                        setTimeLeft("Expired");
                    }
                }
            } catch (err) {
                toast.error(err.response?.data?.msg || "Failed to fetch poll");
            }
        };

        getPoll();

        socket.on('poll-update', (data) => {
            const { newPoll, msg } = data;

            if (newPoll && msg) {
                if (prevStatus.current !== newPoll.status) {
                    if (newPoll.status === "expired") {
                        toast.error(msg);
                        setExpired(true);
                        setTimeLeft("Expired");
                    }
                    prevStatus.current = newPoll.status;
                }
                setPoll((prev) =>
                    JSON.stringify(prev) !== JSON.stringify(newPoll) ? newPoll : prev
                );
            }
        });

        return () => {
            socket.off("poll-update");
        };
    }, [code]);

    useEffect(() => {
        if (!poll?.expiresAt || poll.status === "expired") return;

        const interval = setInterval(() => {
            const now = new Date();
            const expire = new Date(poll.expiresAt);
            const diff = expire - now;
            if (diff <= 0) {
                setTimeLeft("Expired");
                setExpired(true);
                if (prevStatus.current !== "expired") {
                    socket.emit('expire-poll', { code: poll.sessionCode, id: poll._id });
                    prevStatus.current = "expired";
                }
                clearInterval(interval);
            } else {
                const h = Math.floor(diff / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [poll]);

    const submitVote = () => {
        if (expired) {
            toast.info("Poll has expired. You can't vote.");
            return;
        }

        const prevOptId = getPrevVote(poll._id);

        if (!prevOptId) {
            if (selected === "") {
                toast.info('Please select an option');
                return;
            }
            socket.emit("submit-vote", { sessionCode: code, optionId: selected });
            setVoted(true);
            saveVoteInStorage(poll._id, selected);
            toast.success("Vote submitted! Thanks for voting");
            return;
        }

        if (prevOptId === selected) {
            toast.info("Please select a different option");
            return;
        }

        socket.emit("update-vote", { sessionCode: code, prevOptionId: prevOptId, newOptionId: selected });
        setVoted(true);
        saveVoteInStorage(poll._id, selected);
        toast.success("Vote updated!");
    };

    const editVote = () => {
        if (poll.status === 'expired' || expired) {
            toast.error("Poll has been expired! You can't vote now");
            return;
        }
        setVoted(false);
    };

    if (!poll) {
        return (
            <div className="flex justify-center items-center h-64 text-lg text-gray-500">
                Loading poll...
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 mt-6 px-4 sm:px-6 md:px-10 max-sm:w-sm w-lg m-auto">

          <div className="flex flex-col sm:flex-row justify-between sm:justify-evenly items-center mb-4 gap-2">

            <p className="text-lg sm:text-xl font-bold text-center sm:text-right">
              {expired ? "Expired" : `Expires in: ${timeLeft}`}
            </p>

            <span title={expired ? "Expired" : "Active"} className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              Status: <Circle fill={expired ? "red" : "green"} />
            </span>

          </div>
      
          <div className="bg-primary w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto rounded-xl gap-6 py-6 px-4 sm:px-6 text-center shadow-lg flex flex-col">
            <p className="text-white font-bold text-xl sm:text-2xl">{poll.question}</p>
      
            <div className="flex flex-col gap-4">
              {poll?.options.map((opt, idx) => (
                <div key={idx}
                  className={
                    `text-start font-semibold px-4 py-2 rounded-md text-base sm:text-lg 
                    hover:cursor-pointer transition-all duration-200 ${selected !== opt._id ? "text-gray-700 bg-white" 
                    : "text-white bg-green-600" } ${expired ? "opacity-50 pointer-events-none" : ""}`
                }
                  onClick={() => !expired && setSelected(opt._id)}
                >
                  {opt.option}
                </div>
              ))}
            </div>
      
            {!expired &&
                <button
                    className="bg-white text-primary text-base sm:text-lg font-bold px-4 py-2 rounded-md w-fit mx-auto hover:cursor-pointer"
                    onClick={voted ? editVote : submitVote}
                >
                    {voted ? "Edit Response" : "Submit Vote"}
                </button>
            }

          </div>
      
          {voted && !expired && (
            <p className="text-center font-semibold italic text-green-700 text-sm sm:text-base">
              You can see result here after poll has ended.
            </p>
          )}
      
          {poll.status === "expired" && expired && (
            <Link to={`/poll/view/${code}`}
              className="bg-primary text-white font-bold text-base sm:text-lg px-4 py-2 rounded-md mx-auto w-fit hover:cursor-pointer"
            >
              View Results
            </Link>
          )}
        </div>
    );      
}
