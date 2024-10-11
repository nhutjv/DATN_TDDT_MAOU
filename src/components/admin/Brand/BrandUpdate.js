
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateBrandForm = () => {
    const { id } = useParams();
    const history = useHistory();
    const [brand, setBrand] = useState({
        name_brand: '',
        phone: '',
        email: '',
        address: '',
        description: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        
        // Fetch brand details
        axios.get(`http://localhost:8080/admin/api/brands/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setBrand(response.data);
        })
        .catch(error => {
            console.error('Error fetching brand details:', error);
            toast.error('Có lỗi xảy ra khi tải dữ liệu thương hiệu!');
        });
    }, [id]);

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

        // Check if phone number is exactly 10 digits and starts with 0
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

        // Validate inputs before submitting
        if (!validateInputs()) {
            return;
        }

        const token = localStorage.getItem('jwtToken');
        const url = `http://localhost:8080/admin/api/brands/${id}`;

        axios.put(url, brand, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => {
            toast.success('Cập nhật thương hiệu thành công!');
            setTimeout(() => {
                history.push('/admin/brands');
            }, 1000); // Redirect after showing the success message
        })
        .catch(error => {
            console.error('Error updating brand:', error);
            toast.error('Có lỗi xảy ra khi cập nhật thương hiệu!');
        });
    };

   

    return (
        <div className="p-6 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Cập nhật Thương hiệu</h2>
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
                        Cập nhật Thương hiệu
                    </button>
                   
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default UpdateBrandForm;
