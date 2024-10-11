import React from 'react';

function FashionCategoryCard({ image, title, productCount }) {
  return (
    <div className="relative w-full h-56 overflow-hidden rounded-md bg-gray-200">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 p-4 flex flex-col items-start">
        <h3 className="text-lg text-white font-semibold">{title}</h3>
        <p className="text-gray-300">{productCount} sản phẩm</p>
        <button className="mt-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-300 transition">
          XEM NGAY
        </button>
      </div>
    </div>
  );
}

export default FashionCategoryCard;
