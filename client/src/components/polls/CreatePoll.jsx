import { useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { X } from 'lucide-react';


export default function CreatePoll() {
    const [que, setQue] = useState("");
    const [opt, setOpt] = useState(["", ""]);
    const [expireAt, setExpireAt] = useState("");
    const [showPopUp, setShowPopUp] = useState(false);
    const [sessionCode, setSessionCode] = useState('');

    const addPollOpt = () => {
        setOpt([...opt, ""]);
    };

    const handleOptChange = (idx, value) => {
        const newOptions = [...opt];
        newOptions[idx] = value;
        setOpt(newOptions);
    };

    const removeOpt = (idx) => {
        setOpt(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            que,
            options: opt,
            expireAt
        };
        const token = localStorage.getItem('token');

        try {
            let res = await axios.post(`${import.meta.env.VITE_SERVER_API}/polls/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 201) {
                toast.success("Poll Created!");
                setSessionCode(res.data.sessionCode)
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || "Error creating poll.");
        }

        setQue("");
        setOpt(["", ""]);
        setExpireAt(null);
    };

    const handleExpireClick = () => setShowPopUp(true);
    const handleCloseModal = () => setShowPopUp(false);

    const handleExpireChange = (e) => {
        setExpireAt(e.target.value);
    };

    return (
        <>
          <div className="bg-primary sm:mt-10 max-sm:pt-20 mx-auto sm:w-lg max-w-lg max-sm:h-screen max-sm:overflow-hidden w-full sm:rounded-xl flex flex-col gap-3 p-4 sm:max-w-xl sm:p-6">
            <p className="text-white text-2xl sm:text-3xl font-bold py-1 text-center sm:text-left">
              Create Poll
            </p>
    
            <form className="bg-white rounded-xl p-4 m-3 flex flex-col gap-4 sm:p-6" onSubmit={handleSubmit} >

              <div className="flex flex-col gap-2">
                <label className="text-black/70 font-semibold" htmlFor="question">
                  Question
                </label>
                <input
                  id="question"
                  type="text"
                  className="rounded-md p-2 border-2 border-gray-500 text-base sm:text-xl w-full"
                  placeholder="What's your favourite color?"
                  onChange={(e) => setQue(e.target.value)}
                  value={que}
                  required
                />
              </div>
    
              {opt.map((optValue, idx) => (
                <div className="flex flex-col gap-1" key={idx}>
                  <div className="flex justify-between items-center px-2">
                    <p className="text-black/70 font-semibold">Option {idx + 1}</p>
                    {idx > 1 && (
                      <X
                        className="hover:cursor-pointer"
                        color="black"
                        size={"20px"}
                        onClick={() => removeOpt(idx)}
                      />
                    )}
                  </div>

                  <input
                    type="text"
                    className="rounded-md p-2 border-2 border-gray-500 text-base sm:text-md w-full"
                    placeholder={`Option ${idx + 1}`}
                    onChange={(e) => handleOptChange(idx, e.target.value)}
                    value={optValue}
                    required
                  />
                  
                </div>
              ))}
    
              <div className="flex justify-between text-primary font-bold text-sm sm:text-md">
                <span className="hover:cursor-pointer select-none" onClick={addPollOpt}>
                  Add Option +
                </span>
                <span className="hover:cursor-pointer select-none" onClick={handleExpireClick}>
                  Set Expire time
                </span>
              </div>
    
              {showPopUp && (
                <div className="fixed inset-0 bg-gray-400/70 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 max-w-xs w-full mx-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-bold">Set Poll Expiry</h2>
                      <X
                        className="hover:cursor-pointer"
                        color="black"
                        size={"25px"}
                        onClick={handleCloseModal}
                      />
                    </div>
                    <input
                      type="datetime-local"
                      className="border p-2 rounded w-full"
                      value={expireAt}
                      onChange={handleExpireChange}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <button
                      className="bg-primary text-white px-4 py-2 rounded cursor-pointer"
                      onClick={handleCloseModal}
                      type="button"
                    >
                      Enter
                    </button>
                  </div>
                </div>
              )}
    
              {sessionCode && (
                <SessionCode
                  closePopUp={handleCloseModal}
                  code={sessionCode}
                  setCode={setSessionCode}
                />
              )}
    
              <button
                type="submit"
                className="bg-primary text-white py-2 px-6 font-semibold rounded-md w-fit mx-auto text-lg hover:cursor-pointer sm:text-xl"
              >
                Launch Poll
              </button>
            </form>
          </div>
        </>
      );
}

export function SessionCode({closePopUp, code, setCode}){
    const copyCode = () => {
        if (code) {
            navigator.clipboard.writeText(code)
                .then(() => {
                    toast.success("Copied to clipboard!");
                    setCode("");
                })
                .catch(() => {
                    toast.error("Failed to copy!");
                });
        }
    };

    return (
        <>
            <div className="inset-0 bg-gray-400/70 flex items-center justify-center z-50 absolute">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4">
                    <div className="flex justify-between gap-5">
                        <h2 className="text-lg font-bold">Session Code for this Poll</h2>
                        <X
                            className="hover:cursor-pointer"
                            color="black"
                            size={"25px"}
                            onClick={()=> {
                                setCode("");
                                closePopUp();
                            }}
                        />
                    </div>

                    <div>
                        <p className="text-center font-bold text-lg">{code}</p>
                    </div>
                    
                    <button className="bg-primary text-white px-4 py-2 rounded cursor-pointer" onClick={copyCode}>
                        Copy to Clipboard
                    </button>
                </div>
            </div>
        </>
    )
}