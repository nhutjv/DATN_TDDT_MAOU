// import React, { useState, useEffect } from 'react';
// import { useHistory, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const UpdateColor = () => {
//     const { id } = useParams(); // Get the color ID from URL parameters
//     const history = useHistory();
//     const [colorName, setColorName] = useState('');

//     useEffect(() => {
//         // Fetch the existing color details when the component mounts
//         const fetchColor = async () => {
//             try {
//                 const token = localStorage.getItem('jwtToken');
//                 const response = await axios.get(`http://localhost:8080/admin/api/colors/${id}`, {
//                     headers: { 'Authorization': `Bearer ${token}` }
//                 });

//                 if (response.data && response.data.color_name) {
//                     setColorName(response.data.color_name);
//                 } else {
//                     toast.error('Không tìm thấy thông tin màu sắc!');
//                 }
//             } catch (error) {
//                 console.error('Có lỗi xảy ra khi lấy thông tin màu sắc!', error.response?.data || error.message);
//                 toast.error('Có lỗi xảy ra khi lấy thông tin màu sắc!');
//             }
//         };

//         fetchColor();
//     }, [id]);

//     const validateColorName = () => {
//         if (!colorName.trim()) {
//             toast.error('Tên màu sắc không được để trống.');
//             return false;
//         }

//         const regex = /^[a-zA-ZÀ-ỹ\s'-]+$/;
//         if (!regex.test(colorName)) {
//             toast.error('Tên màu sắc không được chứa số và ký tự đặc biêt.');
//             return false;
//         }


//         return true;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (!validateColorName()) {
//             return;
//         }

//         const token = localStorage.getItem('jwtToken');

//         axios.put(`http://localhost:8080/admin/api/colors/${id}`, { color_name: colorName }, {
//             headers: { 'Authorization': `Bearer ${token}` }
//         })
//         .then(() => {
//             toast.success('Cập nhật màu sắc thành công!');
//             setTimeout(() => {
//                 history.push('/admin/colors');
//             }, 1000);
//         })
//         .catch(error => {
//             console.error('Có lỗi xảy ra khi cập nhật màu sắc!', error.response?.data || error.message);
//             toast.error('Có lỗi xảy ra khi cập nhật màu sắc!');
//         });
//     };

 

//     const handleGoBack = () => {
//         history.goBack();
//     };

//     return (
//         <div className="p-6">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Cập nhật Màu sắc</h2>
//                 <button className="bg-gray-200 px-4 py-2 rounded" onClick={handleGoBack}>
//                     Quay lại
//                 </button>
//             </div>

//             <div className="bg-white p-4 rounded shadow">
//                 <h3 className="text-lg font-bold mb-4">Thông tin Màu sắc</h3>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label className="block text-gray-700">Tên màu sắc</label>
//                         <input 
//                             type="text" 
//                             className="w-full border px-4 py-2 rounded mt-1" 
//                             value={colorName}
//                             onChange={e => setColorName(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="flex space-x-4">
//                         <button 
//                             type="submit"
//                             className="bg-blue-500 text-white px-4 py-2 rounded"
//                         >
//                             Cập nhật Màu sắc
//                         </button>
                       
//                     </div>
//                 </form>
//             </div>

//             {/* Toast notification container */}
//             <ToastContainer />
//         </div>
//     );
// };

// export default UpdateColor;


import React, { useState, useRef, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const UpdateColor = () => {
    const { id } = useParams(); // Get the color ID from URL parameters
    const history = useHistory();
    const [colorHex, setColorHex] = useState('#6590D5'); // State to store the color hex value
    const colorPickerRef = useRef(null);
    const changeColorBtnRef = useRef(null);

    useEffect(() => {
        // Fetch the existing color details when the component mounts
        const fetchColor = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get(`http://localhost:8080/admin/api/colors/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data && response.data.color_name) {
                    setColorHex(response.data.color_name); // Set the color hex from the response
                } else {
                    toast.error('Không tìm thấy thông tin màu sắc!');
                }
            } catch (error) {
                console.error('Có lỗi xảy ra khi lấy thông tin màu sắc!', error.response?.data || error.message);
                toast.error('Có lỗi xảy ra khi lấy thông tin màu sắc!');
            }
        };

        fetchColor();
    }, [id]);

    useEffect(() => {
        const colorPicker = colorPickerRef.current;
        const changeColorBtn = changeColorBtnRef.current;

        if (colorPicker && changeColorBtn) {
            // Update color picker value and button background when colorHex changes
            colorPicker.value = colorHex;
            changeColorBtn.style.backgroundColor = colorHex;

            // Listen for color changes
            colorPicker.addEventListener('input', () => {
                const selectedColor = colorPicker.value;
                changeColorBtn.style.backgroundColor = selectedColor;
                setColorHex(selectedColor); // Update the hex color in the state
            });
        }
    }, [colorHex]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('jwtToken');

        axios.put(`http://localhost:8080/admin/api/colors/${id}`, { color_name: colorHex }, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => {
            toast.success('Cập nhật màu sắc thành công!');
            setTimeout(() => {
                history.push('/admin/colors');
            }, 1000);
        })
        .catch(error => {
            console.error('Có lỗi xảy ra khi cập nhật màu sắc!', error.response?.data || error.message);
            toast.error('Có lỗi xảy ra khi cập nhật màu sắc!');
        });
    };

    const handleGoBack = () => {
        history.goBack();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Cập nhật Màu sắc</h2>
                <button className="bg-gray-200 px-4 py-2 rounded" onClick={handleGoBack}>
                    Quay lại
                </button>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold mb-4">Thông tin Màu sắc</h3>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center space-x-2">
                        <input
                            id="colorPickerUpdate"
                            ref={colorPickerRef}
                            className="w-3/12 min-h-full h-48"
                            type="color"
                            value={colorHex} // Set the initial value to colorHex
                        />
                        <div className="w-2/12 text-center mt-20"> Màu xem trước</div>
                        <div
                            id="buttonUpdateColor"
                            ref={changeColorBtnRef}
                            className="inline-block rounded bg-blue-600 px-6 py-2.5 text-xs uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg w-7/12 font-bold text-center mt-47"
                        >
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Cập nhật Màu sắc
                    </button>
                </form>
            </div>

            {/* Toast notification container */}
            <ToastContainer />
        </div>
    );
};

export default UpdateColor;

