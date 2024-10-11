import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterName, setFilterName] = useState('');
    const [sortStock, setSortStock] = useState(null);
    const [showFlashSaleOnly, setShowFlashSaleOnly] = useState(false);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    const fetchProducts = () => {
        const token = localStorage.getItem('jwtToken');

        axios.get('http://localhost:8080/admin/api/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                const productData = response.data;

                const sortedProducts = productData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

                const productPromises = sortedProducts.map(product =>
                    axios.get(`http://localhost:8080/admin/api/variant_products/count-by-product/${product.id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(variantResponse => {
                            const variantCount = variantResponse.data;

                            return axios.get(`http://localhost:8080/admin/api/products/${product.id}/has-flash-sale-variants`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            })
                                .then(flashSaleResponse => ({
                                    ...product,
                                    variantCount: variantCount,
                                    hasFlashSale: flashSaleResponse.data
                                }));
                        })
                );

                Promise.all(productPromises)
                    .then(results => {
                        setProducts(results);
                    })
                    .catch(error => console.error('Error fetching product and variant details:', error));
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    };

    let filteredProducts = products.filter(product =>
        (filterName ? product.name_prod.toLowerCase().includes(filterName.toLowerCase()) : true) &&
        (!showFlashSaleOnly || product.hasFlashSale)
    );

    if (sortStock === 'asc') {
        filteredProducts = filteredProducts.sort((a, b) => a.sum_quantity - b.sum_quantity);
    } else if (sortStock === 'desc') {
        filteredProducts = filteredProducts.sort((a, b) => b.sum_quantity - a.sum_quantity);
    }

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    const handleNextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Danh sách sản phẩm</h2>
                <div className="flex space-x-2">
                    <Link to="/admin/create-product" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Tạo sản phẩm</Link>
                </div>
            </div>

            {/* Bộ lọc */}
            <div className="mb-4 flex space-x-4">
                <div className="w-1/3">
                    <label className="block mb-2 font-semibold">Lọc theo tên sản phẩm:</label>
                    <input
                        type="text"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        className="border px-4 py-2 rounded w-full"
                        placeholder="Tên sản phẩm"
                    />
                </div>
                <div className="w-1/3">
                    <label className="block mb-2 font-semibold">Sắp xếp theo Tồn kho:</label>
                    <select
                        value={sortStock || ''}
                        onChange={(e) => setSortStock(e.target.value)}
                        className="border px-4 py-2 rounded w-full"
                    >
                        <option value="">Mặc định</option>
                        <option value="asc">Tồn kho Tăng dần</option>
                        <option value="desc">Tồn kho Giảm dần</option>
                    </select>
                </div>
                <div className="w-1/3 flex items-center">
                    <input
                        type="checkbox"
                        checked={showFlashSaleOnly}
                        onChange={() => setShowFlashSaleOnly(!showFlashSaleOnly)}
                        className="mr-2"
                    />
                    <label className="font-semibold">Sản phẩm đang giảm giá</label>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full bg-white border">
                    <thead className="table-header">
                        <tr className="text-left">
                            <th className="px-4 py-3 border-b text-center w-1/12">#</th>
                            <th className="px-4 py-3 border-b text-center w-1/6">Hình ảnh</th>
                            <th className="px-4 py-3 border-b text-left w-1/3">Tên sản phẩm</th>
                            <th className="px-4 py-3 border-b text-center w-1/6">Tồn kho</th>
                            <th className="px-4 py-3 border-b text-center w-1/6">Loại</th>
                            <th className="px-4 py-3 border-b text-center w-1/6">Thương hiệu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product, index) => (
                            <tr key={product.id} className={`text-center ${index % 2 === 0 ? '' : 'bg-gray-200'}`}>
                                <td className="px-4 py-4 border-b">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="px-4 py-4 border-b relative">
                                    <img
                                        src={product.image_prod}
                                        alt={product.name_prod}
                                        className="w-16 h-16 object-cover rounded mx-auto"
                                    />
                                    {product.hasFlashSale && (
                                        <div className="absolute top-0 right-12 flex items-center">
                                            <span className="text-red-500 text-3xl">★</span>
                                            <span className="text-red-500 text-xs font-bold ml-1">Sale</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-4 border-b text-left">
                                    <Link
                                        to={`/admin/update-product/${product.id}`}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        {product.name_prod}
                                    </Link>
                                </td>
                                <td className="px-4 py-4 border-b">
                                    {product.sum_quantity} trong {product.variantCount} biến thể
                                </td>
                                <td className="px-4 py-4 border-b">
                                    {product.category?.name_cate || 'Khác'}
                                </td>
                                <td className="px-4 py-4 border-b">
                                    {product.brand?.name_brand || 'Khác'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div>
                    Hiển thị {currentProducts.length} trong tổng số {filteredProducts.length} sản phẩm
                </div>

                <div className="pagination-container">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                    >
                        &lt;
                    </button>
                    {[...Array(totalPages).keys()].map(num => (
                        <button
                            key={num + 1}
                            onClick={() => handlePageChange(num + 1)}
                            className={`pagination-button ${currentPage === num + 1 ? 'active' : ''}`}
                        >
                            {num + 1}
                        </button>
                    ))}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
