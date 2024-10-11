import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    useEffect(() => {
        fetchCategories();
    }, [currentPage]);

    const fetchCategories = () => {
        const token = localStorage.getItem('jwtToken');

        axios.get('http://localhost:8080/admin/api/categories', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            setErrorMessage('Có lỗi xảy ra khi lấy danh sách danh mục!');
        });
    };

    const deleteCategory = (id) => {
        const token = localStorage.getItem('jwtToken');

        axios.delete(`http://localhost:8080/admin/api/categories/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            toast.success('Danh mục đã được xóa thành công!');
            fetchCategories(); // Refresh the category list after deletion
        })
        .catch(error => {
            console.error('Error deleting category:', error);
            toast.error('Có lỗi xảy ra khi xóa danh mục.');
        });
    };

    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const currentCategories = categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    const handleNextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6">
            <ToastContainer />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Danh sách Danh mục</h2>
                <div className="flex space-x-2">
                    <Link to="/admin/create-category" className="bg-blue-500 text-white px-4 py-2 rounded">Tạo Danh mục mới</Link>
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
                            <th className="px-6 py-3 border-b text-left text-gray-700">Tên Danh mục</th>
                            <th className="px-6 py-3 border-b text-left text-gray-700">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.map((category) => (
                            <tr key={category.id}>
                                <td className="px-6 py-4 border-b ">
                                    <Link 
                                        to={`/admin/update-category/${category.id}`}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        {category.name_cate}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 border-b">
                                    <button
                                        onClick={() => deleteCategory(category.id)}
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
                    Hiển thị {currentCategories.length} trong tổng số {categories.length} danh mục
                </div>
                <div className="flex items-center">
                    <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-l ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
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
                        className={`px-3 py-1 rounded-r ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
