import axios from "axios";
import { Circle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BarChart from "../components/BarChart.jsx";
import { socket } from "../utils/socket.js";

export default function PollPage() {
    const navigate = useNavigate();
    const prevStatus = useRef();
    const { code } = useParams();
    const [poll, setPoll] = useState(null);
    const [user, setUser] = useState(null);
    const [totalVotes, setTotalVotes] = useState(0);

    useEffect(() => {
        const fetchPollDetail = async () => {
            try {
                let res = await axios.get(`${import.meta.env.VITE_SERVER_API}/polls/${code}`);
                if (res.status === 200) {
                    setPoll(res.data.poll);
                    setTotalVotes(res.data.poll.options.reduce((sum, o) => sum + o.votes, 0));
                    prevStatus.current = res.data.poll.status;
                }
            } catch (err) {
                toast.error(err.response?.data?.msg || "Failed to fetch poll");
            }
        };

        fetchPollDetail();

        let user = JSON.parse(localStorage.getItem("user"));
        setUser(user);

        socket.emit("join-session", code);

        const pollUpdateHandler = (data) => {
            const { options, totalVotes, newPoll, msg } = data;

            if (newPoll) {
                const wasExpired = prevStatus.current === "expired";
                const isNowExpired = newPoll.status === "expired";

                if (!wasExpired && isNowExpired) {
                    toast.error(msg);
                }

                setPoll(newPoll);
                setTotalVotes(newPoll.options.reduce((sum, o) => sum + o.votes, 0));
                prevStatus.current = newPoll.status;
            } else if (options) {
                setPoll((prev) => ({
                    ...prev,
                    options: options,
                }));
                
                if(totalVotes){
                    setTotalVotes(totalVotes)
                }
            }
        };

        socket.on("poll-update", pollUpdateHandler);

        return () => {
            socket.off("poll-update");
        };
    }, [code]);

    if (!poll) {
        return (
            <div className="flex justify-center items-center h-64 text-lg text-gray-500">
                Loading poll details...
            </div>
        );
    }

    const deletePoll = async () => {
        let token = localStorage.getItem("token");
        let user = JSON.parse(localStorage.getItem("user"));
        try {
            let res = await axios.delete(`${import.meta.env.VITE_SERVER_API}/polls/remove/${poll._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.status === 200) {
                toast.success(res.data.msg);
                navigate(`/user/${user._id}/all-polls`);
            }
        } catch (err) {
            toast.error(err.response.data.msg);
        }
    };

    const expirePoll = () => {
        if (poll && user) {
            socket.emit("expire-poll", { code, id: poll._id });
        }
    };

    let labels = poll.options.map((subArr) => subArr["option"]);
    const data = {
        labels,
        datasets: [
            {
                label: "Votes",
                data: poll.options.map((opt) => opt.votes),
                backgroundColor: "rgba(53, 162, 235, 1)",
            },
        ],
    };

    return (
        <div className="h-full w-full p-4 flex flex-col gap-2 max-w-screen-lg mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h1 className="text-xl sm:text-3xl font-bold text-primary">{poll.question}</h1>
            <h1 className="text-xl sm:text-3xl font-bold text-primary"># {poll.sessionCode}</h1>
          </div>
      
          <div className="flex justify-between items-start sm:items-center gap-2">
            <p className="text-gray-700 text-sm sm:text-base">
              Expiry Time:{" "}
              {new Date(poll.expiresAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}

              <span className="text-gray-700 italic">
                {poll.status === "expired" && " ( expired ) "}
              </span>

            </p>

            <p title={poll.status === "expired" ? "Expired" : "Active"}>
              <Circle fill={poll.status === "expired" ? "red" : "green"} />
            </p>

          </div>
      
          <div className="mt-4 flex flex-col items-center gap-2 w-full">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-700 text-center">Voting Results</h2>
            {totalVotes === 0 ? (
              <p className="text-gray-700 font-bold text-lg sm:text-xl italic text-center">No votes yet</p>
            ) : (
              <div className="w-full sm:w-[700px] sm:h-[350px]">
                <BarChart optionData={data} />
              </div>
            )}
          </div>
      
          <p className="text-sm text-gray-700 font-bold mt-2 text-center sm:text-left">
            Total votes: {totalVotes}
          </p>
      
          {user == null && (
            <p className="text-sm text-gray-700 font-bold mt-2 text-center sm:text-left">
              Created by: {poll.createdBy.name}
            </p>
          )}
      
          {user != null && user._id === poll.createdBy._id && (
            <div className="flex flex-wrap justify-center m-auto sm:justify-start gap-3 mt-4">
              {poll.status !== "expired" && (
                <>
                  <Link className="bg-green-700 text-white font-semibold px-3 py-2 rounded-md" to={`/poll/vote/${code}`} >
                    Join vote
                  </Link>

                  <button className="bg-primary text-white font-semibold px-3 py-2 rounded-md cursor-pointer" onClick={expirePoll} >
                    Expire Poll
                  </button>

                </>
              )}

              <button className="bg-red-500 text-white font-semibold px-3 py-2 rounded-md cursor-pointer" onClick={deletePoll} >
                Delete Poll
              </button>
            </div>
          )}
        </div>
      );
}; 