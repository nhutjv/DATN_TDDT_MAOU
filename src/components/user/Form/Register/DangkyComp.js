import React, { useState } from "react";
import axios from "axios";
// import { useHistory, Link } from 'react-router-dom'; // Import useHistory thay vì useNavigate
import { toast } from "react-toastify";

export default function DangkyComp() {
  const [email, setEmail] = useState("");
  // const [message, setMessage] = useState("");
  // const history = useHistory(); 
  // Sử dụng useHistory cho điều hướng

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(email);
    try {
      // Gửi yêu cầu POST đến API gửi OTP
      const response = await axios.post("http://localhost:8080/api/auth/forgot-password", { emailRQ: email },
      
      );

      if (response && response.data) {
        toast.success(response.data);
      }
    } catch (error) {
      console.error("Error:", error);

      // Xử lý các trường hợp lỗi
      if (error.response) {
        if (error.response.data) {
          toast.error("Error: " + (error.response.data.message || error.response.data));
        } else {
          toast.error("Error: " + error.response.status);
        }
      } else if (error.request) {
        toast.error("Không có phản hồi từ server. Vui lòng thử lại.");
      } else {
        toast.error("Có lỗi xảy ra: " + error.message);
      }
    }
  };

  return (
    <>

      <div className="px-8 mb-4 text-center">
        <h3 className="pt-4 mb-2 text-3xl">Quên Mật Khẩu</h3>
      </div>
      <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Vui lòng nhập email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state on input change
            required
          />
        </div>
        <div className="mb-6 text-center">
          <button
            className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
            type="submit"
             // Call handleSendOtp when button is clicked
          >
            Gửi OTP
          </button>
        </div>

        <hr className="mb-6 border-t" />
        <div className="text-center">
          <a
            className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
            href="/login"
          >
            Đăng nhập!
          </a>
        </div>
        <div className="text-center">
          <a
            className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
            href="/forgot"
          >
            Chưa có tài khoản! Đăng ký
          </a>
        </div>
      </form>
    </>
  );
}


