import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListColor = () => {
    const [colors, setColors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchColors();
    }, [currentPage]);

    const fetchColors = () => {
        const token = localStorage.getItem('jwtToken');

        axios.get('http://localhost:8080/admin/api/colors', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setColors(response.data);
            })
            .catch(error => {
                console.error('Error fetching colors:', error);
                setErrorMessage('Có lỗi xảy ra khi lấy danh sách màu sắc!');
            });
    };

    const totalPages = Math.ceil(colors.length / itemsPerPage);
    const currentColors = colors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    const handleNextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa màu sắc này?');
        if (confirmDelete) {
            const token = localStorage.getItem('jwtToken');

            axios.delete(`http://localhost:8080/admin/api/colors/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(() => {
                    setColors(colors.filter(color => color.id !== id));
                })
                .catch(error => {
                    console.error('Error deleting color:', error);
                    setErrorMessage('Có lỗi xảy ra khi xóa màu sắc!');
                });
        };

    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Danh sách Màu sắc</h2>
                <Link to="/admin/create-color">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                        Thêm Màu sắc
                    </button>
                </Link>
            </div>
            {errorMessage && (
                <div className="mb-4 p-4 bg-red-200 text-red-800 border border-red-300 rounded-lg">
                    {errorMessage}
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 border-b text-left text-gray-700">
                                 Màu sắc</th>
                            <th className="px-6 py-3 border-b text-left text-gray-700">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentColors.map(color => (
                            <tr key={color.id} className="hover:bg-gray-100">
                                <td className="px-6 py-4 border-b">
                                    <Link
                                        to={`/admin/update-color/${color.id}`}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <div className='w-20 h-20' style={{ backgroundColor: color.color_name }}></div>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 border-b">
                                    <button
                                        onClick={() => handleDelete(color.id)}
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
                    Hiển thị {currentColors.length} trong tổng số {colors.length} Màu sắc
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

export default ListColor;
