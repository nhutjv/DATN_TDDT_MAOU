import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from 'react-toastify';

const firebaseConfig = {
    apiKey: "AIzaSyBjBJTCwPtU6-7lWZTYDS0eOQ2_8rQbeaU",
    authDomain: "demoimg-2354e.firebaseapp.com",
    projectId: "demoimg-2354e",
    storageBucket: "demoimg-2354e.appspot.com",
    messagingSenderId: "488841107147",
    appId: "1:488841107147:web:b4583ef4023f803f9fed4e"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const AdminProfile = () => {
    const [user, setUser] = useState({
        fullName: '',
        gender: true,
        birthday: '',
        image_user: '',
    });
    const [formUser, setFormUser] = useState({ ...user });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.id_user;

            axios.get(`http://localhost:8080/admin/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    setUser(response.data);
                    setFormUser(response.data);
                    setPreviewUrl(response.data.image_user);
                })
                .catch((error) => {
                    console.error('Error fetching user information:', error);
                });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormUser({ ...formUser, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) return formUser.image_user;

        setIsUploading(true);
        const storageRef = ref(storage, `avatars/${imageFile.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, imageFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setIsUploading(false);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            setIsUploading(false);
            return '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const userId = jwtDecode(token).id_user;

        let imageUrl = formUser.image_user;

        if (imageFile) {
            imageUrl = await handleImageUpload();
        }

        const updatedUser = {
            ...formUser,
            image_user: imageUrl
        };

        axios.put(`http://localhost:8080/admin/api/users/${userId}`, updatedUser, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {

                setUser(response.data);
                toast.success('Thông tin đã được cập nhật!');
                // this.useEffect(() => {
                    
                // })
            })
            .catch((error) => {
                console.error('Error updating user information:', error);
                alert('Đã có lỗi xảy ra khi cập nhật thông tin.');
            });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                            <img
                                src={previewUrl}
                                alt="Avatar"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-2xl font-bold">{formUser.fullName}</h2>
                        </div>
                    </div>
                    <div className="ml-4">
                        <label htmlFor="file-upload" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                            Đổi ảnh đại diện
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block text-gray-700">Tên đầy đủ</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formUser.fullName}
                            onChange={handleInputChange}
                            className="w-full border px-4 py-2 rounded mt-1"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Giới tính</label>
                        <select
                            name="gender"
                            value={formUser.gender}
                            onChange={handleInputChange}
                            className="w-full border px-4 py-2 rounded mt-1"
                        >
                            <option value={true}>Nam</option>
                            <option value={false}>Nữ</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Ngày sinh</label>
                        <input
                            type="date"
                            name="birthday"
                            value={formUser.birthday}
                            onChange={handleInputChange}
                            className="w-full border px-4 py-2 rounded mt-1"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded mt-4">
                        Cập nhật thông tin
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;
