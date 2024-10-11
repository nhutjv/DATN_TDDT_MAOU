import React, { useState } from 'react';

function CouponCard({ code, discount, description }) {

  const [copied, setCopied] = useState(false);

  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true); 
    setTimeout(() => setCopied(false), 5000); 
  };

  return (
    <div className="border rounded-lg p-3 flex flex-col items-center justify-center bg-white shadow-md max-w-xs mx-auto">
      <div className="flex items-center space-x-4 mb-3">
  
        <div className="bg-blue-500 text-white text-center p-2 rounded-full w-12 h-12 flex items-center justify-center">
          <span className="text-md font-bold">{discount}</span>
        </div>

        <div>
          <h3 className="text-blue-500 font-bold text-base">NHẬP MÃ: {code}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>

      <button
        onClick={handleCopyCode}
        className={`${
          copied ? 'bg-green-600' : 'bg-blue-500'
        } text-white px-3 py-1 rounded-lg mb-2 transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
      >
        {copied ? (
          <div className="flex items-center space-x-2">
            <span>Đã sao chép</span>
            {/* <span>✔️</span>  */}
          </div>
        ) : (
          'Sao chép'
        )}
      </button>
      <a href="#" className="text-blue-500 underline text-sm">Điều kiện</a>
    </div>
  );
}

export default CouponCard;
