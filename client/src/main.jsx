import './../public/styles/index.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {GoogleOAuthProvider} from '@react-oauth/google'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/HomePage.jsx'
import PollPage from './pages/PollPage.jsx';
import Layout from './pages/Layout.jsx';
import VotePage from './pages/VotePage.jsx';
import CreatePoll from './components/polls/CreatePoll.jsx';
import AllPolls from './components/polls/allPolls.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<Layout />}>
            <Route path="/user/:id/poll/create" element={<CreatePoll />} />
            <Route path="/user/:id/all-polls" element={<AllPolls />} />
            <Route path="/poll/view/:code/" element={<PollPage />} />
            <Route path="/poll/vote/:code" element={<VotePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      
    </GoogleOAuthProvider>
  </StrictMode>,
)
