import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const history = useHistory(); // useHistory hook to manage navigation

    useEffect(() => {
        fetchBrands();
    }, [currentPage]);

    const fetchBrands = () => {
        const token = localStorage.getItem('jwtToken');

        axios.get('http://localhost:8080/admin/api/brands', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setBrands(response.data);
            })
            .catch(error => {
                console.error('Error fetching brands:', error);
            });
    };

    const deleteBrand = (id) => {
        const token = localStorage.getItem('jwtToken');

        axios.delete(`http://localhost:8080/admin/api/brands/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success('Thương hiệu đã được xóa thành công!');
                fetchBrands(); // Refresh the brand list after deletion
            })
            .catch(error => {
                console.error('Error deleting brand:', error);
                toast.error('Có lỗi xảy ra khi xóa thương hiệu.');
            });
    };

    const totalPages = Math.ceil(brands.length / itemsPerPage);
    const currentBrands = brands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    const handleNextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6">
            <ToastContainer />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Danh sách Thương hiệu</h2>
                <div className="flex space-x-2">
                    <Link to="/admin/create-brand" className="bg-blue-500 text-white px-4 py-2 rounded">Tạo Thương hiệu mới</Link>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b">Tên Thương hiệu</th>
                            <th className="px-6 py-3 border-b">Số điện thoại</th>
                            <th className="px-6 py-3 border-b">Email</th>
                            <th className="px-6 py-3 border-b">Địa chỉ</th>
                            <th className="px-6 py-3 border-b">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBrands.map((brand) => (
                            <tr key={brand.id}>
                                <td className="px-6 py-4 border-b text-center">
                                    <button
                                        onClick={() => history.push(`/admin/update-brand/${brand.id}`)} // Use history to navigate
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        {brand.name_brand}
                                    </button>
                                </td>
                                <td className="px-6 py-4 border-b text-center">{brand.phone}</td>
                                <td className="px-6 py-4 border-b text-center">{brand.email}</td>
                                <td className="px-6 py-4 border-b text-center">{brand.address}</td>
                                <td className="px-6 py-4 border-b text-center">
                                    <button
                                        onClick={() => deleteBrand(brand.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div>
                    Hiển thị {currentBrands.length} trong tổng số {brands.length} Thương hiệu
                </div>
                <div className="flex items-center">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-l ${currentPage === 1 ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
                    >
                        &lt;
                    </button>
                    {[...Array(totalPages).keys()].map(num => (
                        <button
                            key={num + 1}
                            onClick={() => handlePageChange(num + 1)}
                            className={`px-3 py-1 ${currentPage === num + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {num + 1}
                        </button>
                    ))}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-r ${currentPage === totalPages ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrandList;
