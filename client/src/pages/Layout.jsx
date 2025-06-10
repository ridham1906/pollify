import { useState } from 'react';
import JoinPoll from '../components/polls/JoinPoll.jsx';
import Navbar from './../components/Navbar.jsx';
import { Outlet, useLocation, matchPath } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || matchPath('/user/:id', location.pathname);
  
  const [showPopUp, setShowPopUp] = useState(false);


  return (
    <>
      {!hideNavbar && <Navbar setShowPopUp={setShowPopUp} />}
      <Outlet />
      {showPopUp && <JoinPoll showPopUp={showPopUp} setShowPopUp={setShowPopUp} /> }
    </>
  );
}