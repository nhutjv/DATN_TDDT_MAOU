import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCategory = () => {
    const history = useHistory();
    const [category, setCategory] = useState({
        name_cate: '',
    });

    const handleGoBack = () => {
        history.goBack();
    };

    const validateInputs = () => {
        if (!category.name_cate || category.name_cate.trim() === '') {
            toast.error('Tên danh mục không được để trống.');
            return false;
        }
        // Check for special characters (allowing only letters, numbers, spaces)
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharRegex.test(category.name_cate)) {
            toast.error('Tên danh mục không được chứa ký tự đặc biệt.');
            return false;
        }
        return true;
    };

    const handleSaveCategory = () => {
        // Validate input before making the request
        if (!validateInputs()) {
            return;
        }

        const token = localStorage.getItem('jwtToken');
        const newCategory = { ...category };

        axios.post('http://localhost:8080/admin/api/categories', newCategory, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => {
            toast.success('Tạo danh mục thành công!');
            setTimeout(() => {
                history.push('/admin/categories');
            }, 1000); // Redirect immediately after success
        })
        .catch(error => {
            console.error('Có lỗi xảy ra khi tạo loại sản phẩm!', error);
            toast.error('Có lỗi xảy ra khi tạo danh mục!');
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Tạo danh mục</h2>
                <button className="bg-gray-200 px-4 py-2 rounded" onClick={handleGoBack}>
                    Quay lại
                </button>
            </div>

            {/* Thông tin loại sản phẩm */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold mb-4">Thông tin chung</h3>
                <div className="mb-4">
                    <label className="block text-gray-700">Tên loại danh mục</label>
                    <input 
                        type="text" 
                        className="w-full border px-4 py-2 rounded mt-1" 
                        value={category.name_cate}
                        onChange={e => setCategory({ ...category, name_cate: e.target.value })}
                    />
                </div>
            </div>

            {/* Lưu loại sản phẩm */}
            <button onClick={handleSaveCategory} className="bg-blue-500 text-white px-4 py-2 rounded mt-6">Thêm danh mục</button>

            {/* Toast notification container */}
            <ToastContainer />
        </div>
    );
};

export default CreateCategory;
