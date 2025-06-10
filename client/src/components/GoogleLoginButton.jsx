import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const GoogleLoginButton = () => {

  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    const res = await axios.post(`${import.meta.env.VITE_SERVER_API}/auth/google-auth`, {
      token,
    });

    const { token: appToken, user } = res.data;

    localStorage.setItem('token', appToken);
    localStorage.setItem('user', JSON.stringify(user));
    navigate(`/user/${user._id}/poll/create`);
    toast.success(`Login Successful! Welcome ${user.name}`)
  };

  const handleError = (err)=> {
    console.error(err);
    toast.error("Login Failed!");
  } 

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};

export default GoogleLoginButton;
