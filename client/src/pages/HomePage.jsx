import { useEffect } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import ParticipantJoinBar from "../components/ParticipantJoinBar";
import { useNavigate } from "react-router-dom";

function HomePage() {

  const navigate = useNavigate();

  useEffect(()=> {
    let user = JSON.parse(localStorage.getItem('user'));
    if(user){
      navigate(`/user/${user._id}/poll/create`)
    }
  })

  return (
    <>
      <div className="h-screen overflow-hidden bg-primary">
        <h1 className="sm:text-4xl text-5xl py-5 px-6 text-white font-bold mb-10">Pollify</h1>

        <div className="flex flex-col gap-6 items-center justify-center w-full text-center">
          <h1 className="max-sm:text-6xl text-5xl text-white font-bold"> Start a Poll</h1>
          <p className="text-md max-sm:text-lg font-semibold text-white ">Real-time polls, Real-time feedback</p>
          
          <div className="max-sm:mt-6 mt-4">
            <GoogleLoginButton />
          </div>
          
          <p className="m-auto max-sm:text-xl text-md font-bold text-white mt-5">OR</p>
        </div>      

        <div className="mt-10">
          <ParticipantJoinBar sideText={"Joining as a Participant ?"}/>
        </div>
      </div>
    </>
  )
}

export default HomePage;
