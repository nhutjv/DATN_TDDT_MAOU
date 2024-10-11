import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SizeMain = () => {
    const [sizes, setSizes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchSizes();
    }, [currentPage]); 

    const fetchSizes = () => {
        const token = localStorage.getItem('jwtToken');

        axios.get('http://localhost:8080/admin/api/sizes', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setSizes(response.data);
        })
        .catch(error => {
            console.error('Error fetching sizes:', error);
            setErrorMessage('Có lỗi xảy ra khi lấy danh sách kích thước!');
        });
    };

    const totalPages = Math.ceil(sizes.length / itemsPerPage);
    const currentSizes = sizes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    const handleNextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleDelete = (id) => {
        // Hiển thị hộp thoại xác nhận trước khi xóa
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa kích thước này?');

        if (confirmDelete) {
            const token = localStorage.getItem('jwtToken');

            axios.delete(`http://localhost:8080/admin/api/sizes/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(() => {
                setSizes(sizes.filter(size => size.id !== id));
            })
            .catch(error => {
                console.error('Error deleting size:', error);
                setErrorMessage('Có lỗi xảy ra khi xóa kích thước!');
            });
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Danh sách kích thước</h2>
                <div className="flex space-x-2">
                    <Link to="/admin/create-size" className="bg-blue-500 text-white px-4 py-2 rounded">Tạo kích thước</Link>
                </div>
            </div>

            {errorMessage && (
                <div className="mb-4 p-4 bg-red-200 text-red-800 border border-red-300 rounded-lg">
                    {errorMessage}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b text-left text-gray-700">Kích thước</th>
                            <th className="px-6 py-3 border-b text-left text-gray-700">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSizes.map((size) => (
                            <tr key={size.id}>
                                <td className="px-6 py-4 border-b">
                                    <Link 
                                        to={`/admin/update-size/${size.id}`}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        {size.name_size}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 border-b">
                                    <button 
                                        onClick={() => handleDelete(size.id)}
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
                    Hiển thị {currentSizes.length} trong tổng số {sizes.length} kích thước
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

export default SizeMain;
