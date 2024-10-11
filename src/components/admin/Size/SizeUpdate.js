import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SizeUpdate = () => {
    const { id } = useParams();
    const history = useHistory();
    const [sizeName, setSizeName] = useState('');

    // Fetch size information
    const fetchSize = useCallback(() => {
        const token = localStorage.getItem('jwtToken');

        axios.get(`http://localhost:8080/admin/api/sizes/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setSizeName(response.data.name_size);
        })
        .catch(error => {
            console.error('Có lỗi xảy ra khi lấy thông tin size!', error);
            toast.error('Có lỗi xảy ra khi lấy thông tin size!');
        });
    }, [id]);

    useEffect(() => {
        fetchSize();
    }, [fetchSize]);

    // Validate size name
    const validateSizeName = (name) => {
        const sizeNameRegex = /^[a-zA-Z0-9]+$/;
        if (name.trim() === '') {
            return 'Tên kích thước không được để trống!';
        }
        if (!sizeNameRegex.test(name)) {
            return ' Không chứa ký tự đặc biệt!';
        }
        return '';
    };

    // Handle update
    const handleUpdate = (e) => {
        e.preventDefault();

        const error = validateSizeName(sizeName);
        if (error) {
            toast.error(error);
            return;
        }

        const token = localStorage.getItem('jwtToken');

        axios.put(`http://localhost:8080/admin/api/sizes/${id}`, { name_size: sizeName }, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => {
            toast.success('Cập nhật size thành công!');
            setTimeout(() => {
                history.push('/admin/sizes');
            }, 1000);
           
        })
        .catch(error => {
            console.error('Có lỗi xảy ra khi cập nhật size!', error);
            toast.error('Có lỗi xảy ra khi cập nhật size!');
        });
    };

   
    return (
        <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Cập Nhật Size</h2>

            <form onSubmit={handleUpdate}>
                <div className="mb-4">
                    <label htmlFor="sizeName" className="block text-gray-700">Tên Size</label>
                    <input
                        type="text"
                        id="sizeName"
                        value={sizeName}
                        onChange={(e) => setSizeName(e.target.value)}
                        className="border px-4 py-2 rounded w-full"
                    />
                </div>
                <div className="flex space-x-4">
                    <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                        Cập Nhật
                    </button>
                    
                </div>
            </form>

            {/* Toast notification container */}
            <ToastContainer />
        </div>
    );
};

export default SizeUpdate;
