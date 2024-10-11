import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SizeCreate = () => {
    const history = useHistory();
    const [nameSize, setNameSize] = useState('');

    const validateSizeName = (name) => {
        const sizeNameRegex = /^[a-zA-Z0-9]+$/;
        if (name.trim() === '') {
            return 'Tên kích thước không được để trống!';
        }
        if (!sizeNameRegex.test(name)) {
            return 'Không chứa ký tự đặc biệt!';
        }
        return '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const error = validateSizeName(nameSize);
        if (error) {
            toast.error(error); // Hiển thị thông báo lỗi với toast.error
            return;
        }

        const token = localStorage.getItem('jwtToken');

        axios.post('http://localhost:8080/admin/api/sizes', { name_size: nameSize }, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => {
            toast.success('Tạo kích thước thành công!'); // Hiển thị thông báo thành công với toast.success
            setTimeout(() => {
                history.push('/admin/sizes');
            }, 1000);
        })
        .catch(error => {
            console.error('Có lỗi xảy ra khi tạo kích thước!', error);
            toast.error('Có lỗi xảy ra khi tạo kích thước!'); // Hiển thị thông báo lỗi với toast.error
        });
    };

    const handleGoBack = () => {
        history.goBack();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Tạo Kích thước</h2>
                <button className="bg-gray-200 px-4 py-2 rounded" onClick={handleGoBack}>
                    Quay lại
                </button>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold mb-4">Thông tin Kích thước</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Tên kích thước</label>
                        <input 
                            type="text" 
                            className="w-full border px-4 py-2 rounded mt-1" 
                            value={nameSize}
                            onChange={e => setNameSize(e.target.value)}
                     
                        />
                    </div>
                    <button 
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Lưu Kích thước
                    </button>
                </form>
            </div>

            {/* Toast notification container */}
            <ToastContainer />
        </div>
    );
};

export default SizeCreate;
