import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";

/**
 * This component is a wrapper for all protected routes for a user.
 * It will check if the user is logged in by checking if there is a token in local storage.
 * If the user is not logged in, it will redirect to /login.
 * After the user is logged in, it will fetch the user profile and set the state to loaded.
 * If the user is already logged in, it will fetch the user profile and set the state to loaded.
 * If there is an error while fetching the user profile, it will remove the token from local storage and redirect to /login.
 */
const UserProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { setUser } = useContext(UserDataContext);
  const [isloading, setisLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => {
        if (respone.status === 200) {
          const data = respone.data;
          setUser(data.user);
          setisLoading(false);
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token, setUser, navigate]);

  if (isloading) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
};

export default UserProtectWrapper;
