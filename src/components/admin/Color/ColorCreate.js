// import React, { useState, useEffect, useRef } from 'react';
// import { useHistory } from 'react-router-dom';
// import axios from 'axios';

// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const CreateColor = () => {
//     // const history = useHistory();
//     // const [colorName, setColorName] = useState('');

//     // const validateColorName = () => {
//     //     // Ensure color name is not empty
//     //     if (!colorName.trim()) {
//     //         toast.error('Tên màu sắc không được để trống.');
//     //         return false;
//     //     }

//     //     // Ensure the color name contains only letters (optional validation)
//     //     const regex = /^[a-zA-ZÀ-ỹ\s'-]+$/;
//     //     if (!regex.test(colorName)) {
//     //         toast.error('Tên màu sắc không được chứa số và ký tự đặc biêt.');
//     //         return false;
//     //     }

//     const colorPickerRef = useRef(null);
//     const changeColorBtnRef = useRef(null);

//     useEffect(() => {
//         const colorPicker = colorPickerRef.current;
//         const changeColorBtn = changeColorBtnRef.current;

//         if (colorPicker && changeColorBtn) {
//             changeColorBtn.style.backgroundColor = colorPicker.value;

//             colorPicker.addEventListener('input', () => {
//                 changeColorBtn.style.backgroundColor = colorPicker.value;
//             });
//         }
//     }, []); 

//     //     return true;
//     // };

//     // const handleSubmit = (e) => {
//     //     e.preventDefault();

//     //     // Validate color name
//     //     if (!validateColorName()) {
//     //         return;
//     //     }

//     //     const token = localStorage.getItem('jwtToken');

//     //     axios.post('http://localhost:8080/admin/api/colors', { color_name: colorName }, {
//     //         headers: { 'Authorization': `Bearer ${token}` }
//     //     })
//     //         .then(() => {
//     //             toast.success('Tạo màu sắc thành công!');
//     //             setTimeout(() => {
//     //                 history.push('/admin/colors');
//     //             }, 1000);
//     //         })
//     //         .catch(error => {
//     //             console.error('Có lỗi xảy ra khi tạo màu sắc!', error);
//     //             toast.error('Có lỗi xảy ra khi tạo màu sắc!');
//     //         });
//     // };

//     // const handleGoBack = () => {
//     //     history.goBack();
//     // };
//     const colorPicker = document.getElementById("nativeColorPicker1");
//     const changeColorBtn = document.getElementById("burronNativeColor");

//     changeColorBtn.style.backgroundColor = colorPicker.value;
//     colorPicker.addEventListener("input", () => {
//         changeColorBtn.style.backgroundColor = colorPicker.value;
//     });

//     return (
//         <div className="p-6">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Tạo Màu sắc</h2>
//                 <button className="bg-gray-200 px-4 py-2 rounded"
//                 //onClick={handleGoBack}
//                 >
//                     Quay lại
//                 </button>
//             </div>

//             <div className="bg-white p-4 rounded shadow">
//                 <h3 className="text-lg font-bold mb-4">Thông tin Màu sắc</h3>
//                 <form
//                 //onSubmit={handleSubmit}
//                 >
//                     {/* choose color */}
//                     <div className="flex justify-center space-x-2">
//                         <input 
//                             id="nativeColorPicker1"
//                             ref={colorPickerRef}
//                             className="w-3/12 min-h-full h-48"
//                             type="color"
//                             defaultValue="#6590D5" // defaultValue for uncontrolled components
//                         />
//                         <div className="w-2/12 text-center mt-20"> Màu xem trước</div>
//                         <div
//                             id="burronNativeColor"
//                             ref={changeColorBtnRef}
//                             className="inline-block rounded bg-blue-600 px-6 py-2.5 text-xs uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg w-7/12 font-bold text-center mt-47"
//                         >
//                         </div>
//                     </div>
//                     <button
//                         type="submit"
//                         className="bg-blue-500 text-white px-4 py-2 rounded"
//                     >
//                         Lưu Màu sắc
//                     </button>
//                 </form>
//             </div>

//             {/* Toast notification container */}
//             <ToastContainer />
//         </div>
//     );
// };

// export default CreateColor;

// import React, { useState, useRef, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const CreateColor = () => {
//     const colorPickerRef = useRef(null);
//     const changeColorBtnRef = useRef(null);

//     // Use useEffect to apply logic after component renders
//     useEffect(() => {
//         const colorPicker = colorPickerRef.current;
//         const changeColorBtn = changeColorBtnRef.current;

//         if (colorPicker && changeColorBtn) {
//             changeColorBtn.style.backgroundColor = colorPicker.value;

//             colorPicker.addEventListener('input', () => {
//                 changeColorBtn.style.backgroundColor = colorPicker.value;
//             });
//         }
//     }, []); // Empty array means this runs once when the component mounts

//     return (
//         <div className="p-6">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Tạo Màu sắc</h2>
//                 <button className="bg-gray-200 px-4 py-2 rounded">
//                     Quay lại
//                 </button>
//             </div>

//             <div className="bg-white p-4 rounded shadow">
//                 <h3 className="text-lg font-bold mb-4">Thông tin Màu sắc</h3>
//                 <form>
//                     <div className="flex justify-center space-x-2">
//                         <input 
//                             id="nativeColorPicker1"
//                             ref={colorPickerRef}
//                             className="w-3/12 min-h-full h-48"
//                             type="color"
//                             defaultValue="#6590D5" // defaultValue for uncontrolled components
//                         />
//                         <div className="w-2/12 text-center mt-20"> Màu xem trước</div>
//                         <div
//                             id="burronNativeColor"
//                             ref={changeColorBtnRef}
//                             className="inline-block rounded bg-blue-600 px-6 py-2.5 text-xs uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg w-7/12 font-bold text-center mt-47"
//                         >
//                         </div>
//                     </div>
//                     <button
//                         type="submit"
//                         className="bg-blue-500 text-white px-4 py-2 rounded"
//                     >
//                         Lưu Màu sắc
//                     </button>
//                 </form>
//             </div>

//             {/* Toast notification container */}
//             <ToastContainer />
//         </div>
//     );
// };

// export default CreateColor;




import React, { useState, useRef, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import  axios  from 'axios'
import 'react-toastify/dist/ReactToastify.css';

const CreateColor = () => {
    const history = useHistory();
    const [colorHex, setColorHex] = useState('#6590D5'); // State to store the color hex value
    const colorPickerRef = useRef(null);
    const changeColorBtnRef = useRef(null);

    useEffect(() => {
        const colorPicker = colorPickerRef.current;
        const changeColorBtn = changeColorBtnRef.current;

        if (colorPicker && changeColorBtn) {
            changeColorBtn.style.backgroundColor = colorPicker.value;

            // Listen for color changes and update both button and state
            colorPicker.addEventListener('input', () => {
                const selectedColor = colorPicker.value;
                changeColorBtn.style.backgroundColor = selectedColor;
                setColorHex(selectedColor); // Update the hex color in the state
            });
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can now access the selected hex color from colorHex
        console.log('Selected color hex code:', colorHex);
        // Continue with form submission or other logic

        const token = localStorage.getItem('jwtToken');

        axios.post('http://localhost:8080/admin/api/colors', 
            { color_name: colorHex.toString() }, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(() => {
                toast.success(`Tạo màu sắc thành công! Mã màu đã chọn: ${colorHex}`);
                setTimeout(() => {
                    history.push('/admin/colors');
                }, 1000);
            })
            .catch(error => {
                console.error('Có lỗi xảy ra khi tạo màu sắc!', error);
                toast.error('Có lỗi xảy ra khi tạo màu sắc!');
            });
    };

    const handleGoBack = () => {
        history.goBack();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Tạo Màu sắc</h2>
                <button onClick={handleGoBack} className="bg-gray-200 px-4 py-2 rounded">Quay lại</button>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold mb-4">Thông tin Màu sắc</h3>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center space-x-2">
                        <input
                            id="nativeColorPicker1"
                            ref={colorPickerRef}
                            className="w-3/12 min-h-full h-48"
                            type="color"
                            defaultValue="#6590D5"
                        />
                        <div className="w-2/12 text-center mt-20"> Màu xem trước</div>
                        <div
                            id="burronNativeColor"
                            ref={changeColorBtnRef}
                            className="inline-block rounded bg-blue-600 px-6 py-2.5 text-xs uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg w-7/12 font-bold text-center mt-47"
                        >
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Lưu Màu sắc
                    </button>
                </form>
            </div>

            {/* Toast notification container */}
            <ToastContainer />
        </div>
    );
};

export default CreateColor;


