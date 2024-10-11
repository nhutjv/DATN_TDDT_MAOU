import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [message, setMessage] = useState("");
  const history = useHistory();
  const location = useLocation();
  const [token, setToken] = useState("");

  useEffect(() => {
    // Retrieve token from the URL
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.warning("Không tìm thấy người dùng. Vui lòng kiểm tra mail");
      history.push("/forgot");
    }
  }, [location, history]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Xác nhận mật khẩu không khớp!!");
      return;
    }

    try {
      // Call the reset-password API
      const response = await axios.post("http://localhost:8080/api/auth/reset-password", {
        token: token, // pass the token from the URL
        newPassword: newPassword,
        confirmPassword: confirmPassword
      });

      if (response && response.data) {
        toast.success(response.data);

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          history.push("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);

      // Handle any errors returned from the server
      if (error.response) {
        if (error.response.data) {
          toast.error("Error: " + (error.response.data.message || error.response.data));
        } else {
          toast.error("Error: " + error.response.status);
        }
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("An error occurred: " + error.message);
      }
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Reset Password</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>Enter your new password below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="password"
                className="peer block w-full rounded border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                className="peer block w-full rounded border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full py-3 rounded bg-blue-600 text-white font-bold"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
