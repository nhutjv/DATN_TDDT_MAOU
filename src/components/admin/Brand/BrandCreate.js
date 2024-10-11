
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BrandForm = ({ onSubmit, brandData = {} }) => {
    const [brand, setBrand] = useState({
        name_brand: brandData.name_brand || '',
        phone: brandData.phone || '',
        email: brandData.email || '',
        address: brandData.address || '',
        description: brandData.description || '',
    });

    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBrand((prevBrand) => ({
            ...prevBrand,
            [name]: value,
        }));
    };

    // Validate email and phone number
    const validateInputs = () => {

        // Check if all required fields are filled
        if (!brand.name_brand.trim() || !brand.phone.trim() || !brand.email.trim() || !brand.address.trim()) {
            toast.error('Vui lòng điền đầy đủ tất cả thông tin.');
            return false;
        }

        // Check if phone number is exactly 10 digits
        if (!/^0\d{9}$/.test(brand.phone)) {
            toast.error('Số điện thoại phải bắt đầu bằng số 0 và đúng 10 kí tự.');
            return false;
        }

        // Check if email contains an @ symbol
        if (!brand.email.includes('@')) {
            toast.error('Email không đúng định dạng.');
            return false;
        }

        return true;
    };

    const handleGoBack = () => {
        history.goBack();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate inputs
        if (!validateInputs()) {
            return;
        }

        // POST or PUT request to create or update brand
        const token = localStorage.getItem('jwtToken');
        const url = brandData.id 
            ? `http://localhost:8080/admin/api/brands/${brandData.id}` 
            : 'http://localhost:8080/admin/api/brands';

        const method = brandData.id ? 'put' : 'post';

        axios({
            method,
            url,
            data: brand,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
           toast.success('Tạo thương hiệu thành công!');
            setTimeout(() => {
                history.push('/admin/brands');
            }, 1000); // Redirect after showing the success message
        })
        .catch(error => {
            console.error('Error saving brand:', error);
            // Handle server error, display error message
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message}`);
            } else {
                toast.error('Có lỗi xảy ra khi lưu thương hiệu.');
            }
        });
    };

    return (
        <div className="p-6 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{brandData.id ? 'Cập nhật Thương hiệu' : 'Tạo Thương hiệu mới'}</h2>
                <button 
                    className="bg-gray-200 px-4 py-2 rounded" 
                    onClick={handleGoBack}
                >
                    Quay lại
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Tên Thương hiệu</label>
                    <input
                        type="text"
                        name="name_brand"
                        value={brand.name_brand}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Số điện thoại</label>
                    <input
                        type="text"
                        name="phone"
                        value={brand.phone}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={brand.email}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Địa chỉ</label>
                    <input
                        type="text"
                        name="address"
                        value={brand.address}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Mô tả</label>
                    <textarea
                        name="description"
                        value={brand.description}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded mt-1"
                    ></textarea>
                </div>
                <div className="flex space-x-4">
                    <button 
                        type="submit" 
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        {brandData.id ? 'Cập nhật' : 'Thêm Thương hiệu'}
                    </button>
                </div>
            </form>

            <ToastContainer />
        </div>
    );
};

export default BrandForm;

