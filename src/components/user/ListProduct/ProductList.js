import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = ({ onProductClick }) => {
    const [products, setProducts] = useState([]);
    const [priceRanges, setPriceRanges] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8; 


    useEffect(() => {
        axios.get('http://localhost:8080/user/api/products1')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

   
    useEffect(() => {
        products.forEach(product => {
            axios.get(`http://localhost:8080/user/api/variants/price-range/${product.id}`)
                .then(response => {
                    setPriceRanges(prevState => ({
                        ...prevState,
                        [product.id]: response.data
                    }));
                })
                .catch(error => {
                    console.error('Error fetching price range:', error);
                });
        });
    }, [products]);

    const totalPages = Math.ceil(products.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <>
           <div className="mt-3">
           <h2 className="text-3xl text-center mb-4">TẤT CẢ SẢN PHẨM</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-4"> 
                {paginatedProducts.map((item, index) => (
                    <div className="relative group" key={index}>
                        {/* Phần ảnh sản phẩm */}
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                            <img
                                onClick={() => onProductClick(item)}
                                src={item.image_prod}
                                alt={item.name_prod}
                                className="object-cover object-center w-full h-full group-hover:opacity-75 cursor-pointer"
                            />
                        </div>
                        {/* Phần thông tin sản phẩm */}
                        <div className="mt-4 text-left">
                            <h3 className="text-left text-gray-700">
                                <button onClick={() => onProductClick(item)}>
                                    {item.name_prod}
                                </button>
                            </h3>

                            {/* Hiển thị khoảng giá */}
                            <p className="text-lg text-blue-700 font-bold">
                                {priceRanges[item.id]
                                    ? (priceRanges[item.id].minPrice === priceRanges[item.id].maxPrice
                                        ? `${priceRanges[item.id].minPrice.toLocaleString()} đ` 
                                        : `${priceRanges[item.id].minPrice.toLocaleString()} đ - ${priceRanges[item.id].maxPrice.toLocaleString()} đ` 
                                    )
                                    : 'Đang tải...'}  
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            <div className="flex justify-center items-center space-x-4 mt-6 mb-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-lg text-gray-500 disabled:text-gray-300"
                >
                    &laquo;
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`w-8 h-8 flex justify-center items-center rounded-full text-md transition-all ${currentPage === index + 1 ? 'bg-black text-white font-bold' : 'text-gray-600 hover:bg-gray-300'
                          }`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-lg text-gray-500 disabled:text-gray-300"
                >
                    &raquo;
                </button>
            </div>
            </div>
        </>
    );
};

export default ProductList;
