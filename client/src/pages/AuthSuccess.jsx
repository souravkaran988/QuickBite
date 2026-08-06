import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      // Get token from URL
      const token = searchParams.get("token");

      if (!token) {
        toast.error("Authentication failed!");
        navigate("/login");
        return;
      }

      try {
        // Save token temporarily to make the API call
        localStorage.setItem("token", token);

        // Get user data using the token
        const { data } = await axiosInstance.get("/auth/me");

        if (data.success) {
          // Save user and token in Redux
          dispatch(setCredentials({ user: data.data, token }));
          toast.success("Login successful!");
          navigate("/");
        }
      } catch (error) {
        localStorage.removeItem("token");
        toast.error("Authentication failed!");
        navigate("/login");
      }
    };

    handleAuthSuccess();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">
          Completing login, please wait...
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;