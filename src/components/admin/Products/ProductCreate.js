import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBjBJTCwPtU6-7lWZTYDS0eOQ2_8rQbeaU",
    authDomain: "demoimg-2354e.firebaseapp.com",
    projectId: "demoimg-2354e",
    storageBucket: "demoimg-2354e.appspot.com",
    messagingSenderId: "488841107147",
    appId: "1:488841107147:web:b4583ef4023f803f9fed4e"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const CreateProductWithVariants = () => {
    const history = useHistory();
    const [product, setProduct] = useState({
        name_prod: '',
        description: '',
        brandId: '',
        categoryId: '',
        image_prod: '' 
    });
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [flashSales, setFlashSales] = useState([]);
    const [showVariants, setShowVariants] = useState(false); 
    const [variants, setVariants] = useState(() => JSON.parse(localStorage.getItem('variants')) || [{
        color: '',
        size: '',
        price: '',
        quantity: '',
        image_variant: '', 
        previewUrl_variant: ''
    }]);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            toast.error('Token không tồn tại!');
            return;
        }


 
        const fetchData = async () => {
            try {
                const [brandsResponse, categoriesResponse, colorsResponse, sizesResponse, flashSalesResponse] = await Promise.all([
                    axios.get('http://localhost:8080/admin/api/brands', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/admin/api/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/admin/api/colors', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/admin/api/sizes', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/admin/api/flashsales', { headers: { 'Authorization': `Bearer ${token}` } }),
                ]);

                setBrands(brandsResponse.data);
                setCategories(categoriesResponse.data);
                setColors(colorsResponse.data);
                setSizes(sizesResponse.data);
                setFlashSales(flashSalesResponse.data);
            } catch (error) {
                toast.error('Lỗi khi tải dữ liệu!');
            }
        };

        fetchData();
    }, []);

    // Quản lý sự thay đổi trong biến thể
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    // Thay đổi giá trị của từng biến thể
    const handleVariantChange = (index, e) => {
        const { name, value } = e.target;
        const newVariants = [...variants];
        newVariants[index][name] = value;
        setVariants(newVariants);
        localStorage.setItem('variants', JSON.stringify(newVariants));
    };

    // Upload ảnh biến thể
    const handleVariantImageChange = async (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newVariants = [...variants];
            newVariants[index].previewUrl_variant = URL.createObjectURL(file); // Tạo URL để xem trước ảnh

            // Upload ảnh lên Firebase Storage và lấy URL
            try {
                const imageUrl = await uploadImage(file, `variant-images/${file.name}`);
                newVariants[index].image_variant = imageUrl; // Lưu URL của ảnh sau khi upload
                setVariants(newVariants); // Cập nhật biến thể với URL ảnh
                localStorage.setItem('variants', JSON.stringify(newVariants)); // Lưu lại vào localStorage
            } catch (error) {
                toast.error('Lỗi khi tải hình ảnh biến thể!');
            }
        }
    };


    // Upload ảnh sản phẩm
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));

            // Upload ngay lập tức và lưu trữ URL
            try {
                const imageUrl = await uploadImage(file, `images/${file.name}`);
                setProduct({ ...product, image_prod: imageUrl });
            } catch (error) {
                toast.error('Lỗi khi tải hình ảnh sản phẩm!');
            }
        }
    };

    // Hàm tối ưu hóa việc upload ảnh
    const uploadImage = async (file, path) => {
        setIsUploading(true); // Đặt trạng thái tải lên
        const storageRef = ref(storage, path); // Tạo đường dẫn lưu trữ Firebase
        const snapshot = await uploadBytes(storageRef, file); // Tải ảnh lên Firebase
        const downloadURL = await getDownloadURL(snapshot.ref); // Lấy URL tải về của ảnh
        setIsUploading(false); // Kết thúc quá trình tải lên
        return downloadURL; // Trả về URL tải về
    };


    // Thêm biến thể mới
    const handleAddVariant = () => {
        setVariants([...variants, { color: '', size: '', price: '', quantity: '', image_variant: '', previewUrl_variant: '' }]);
    };

    // Xóa biến thể
    const handleRemoveVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
        localStorage.setItem('variants', JSON.stringify(newVariants));
    };

    // Xử lý lưu sản phẩm và các biến thể
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const token = localStorage.getItem('jwtToken');
    //     if (!token) {
    //         toast.error('Bạn chưa đăng nhập!');
    //         return;
    //     }

    //     // Validate thông tin sản phẩm và biến thể
    //     if (!product.name_prod || !product.categoryId || !product.brandId || !product.image_prod) {
    //         toast.error('Vui lòng điền đầy đủ thông tin sản phẩm và chọn ảnh!');
    //         return;
    //     }

    //     // Validate thông tin từng biến thể
    //     for (let i = 0; i < variants.length; i++) {
    //         if (!variants[i].color || !variants[i].size || variants[i].price <= 0 || !variants[i].image_variant) {
    //             toast.error(`Vui lòng điền đầy đủ thông tin và chọn ảnh cho biến thể ${i + 1}`);
    //             return;
    //         }
    //     }

    //     const newProduct = {
    //         ...product,
    //         status_prod: 1
    //     };

    //     // Lưu sản phẩm vào backend
    //     try {
    //         const productResponse = await axios.post('http://localhost:8080/admin/api/products', newProduct, {
    //             headers: { 'Authorization': `Bearer ${token}` }
    //         });

    //         const productId = productResponse.data.id;
    //         // Lưu từng biến thể sau khi sản phẩm được tạo
    //         for (let i = 0; i < variants.length; i++) {
    //             const variantData = {
    //                 product: { id: productId },
    //                 color: { id: variants[i].color },
    //                 size: { id: variants[i].size },
    //                 price: variants[i].price,
    //                 quantity: variants[i].quantity,
    //                 image_variant: variants[i].image_variant,
    //                 flashSale: variants[i].flashSaleId ? { id: variants[i].flashSaleId } : null
    //             };

    //             await axios.post('http://localhost:8080/admin/api/variant_products', variantData, {
    //                 headers: { 'Authorization': `Bearer ${token}` }
    //             });
    //         }

    //         localStorage.removeItem('variants');
    //         toast.success('Tạo sản phẩm và biến thể thành công!');
    //         history.push('/admin/products');
    //     } catch (error) {
    //         toast.error('Có lỗi xảy ra khi tạo sản phẩm!');
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            toast.error('Bạn chưa đăng nhập!');
            return;
        }
    
        if (!product.name_prod || !product.categoryId || !product.brandId || !product.image_prod) {
            toast.error('Vui lòng điền đầy đủ thông tin sản phẩm và chọn ảnh!');
            return;
        }
    
        const newProduct = { ...product, status_prod: 1 };
    
        try {
            const productResponse = await axios.post('http://localhost:8080/admin/api/products', newProduct, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const productId = productResponse.data.id;
    
            if (showVariants) {
                for (let i = 0; i < variants.length; i++) {
                    const variantData = {
                        product: { id: productId },
                        color: { id: variants[i].color },
                        size: { id: variants[i].size },
                        price: variants[i].price,
                        quantity: variants[i].quantity,
                        image_variant: variants[i].image_variant,
                    };
                    await axios.post('http://localhost:8080/admin/api/variant_products', variantData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
            }
    
       
            toast.success('Tạo sản phẩm thành công!');
    
     
            setTimeout(() => {
                history.push('/admin/products');
            }, 1500);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo sản phẩm!');
        }
    };
    

    const handleGoBack = () => {
        history.push('/admin/products');
    };
    const toggleVariants = () => {
        setShowVariants(!showVariants);
    };
    return (
        <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
            <ToastContainer />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Tạo sản phẩm mới</h2>
                <div className="flex space-x-2">
                    <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleGoBack}>
                        Quay lại
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Tên sản phẩm */}
                        <div>
                            <label className="block text-gray-700">Tên sản phẩm</label>
                            <input
                                type="text"
                                name="name_prod"
                                className="w-full border px-4 py-2 rounded mt-1"
                                value={product.name_prod}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Loại sản phẩm */}
                        <div>
                            <label className="block text-gray-700">Loại sản phẩm</label>
                            <select
                                name="categoryId"
                                className="w-full border px-4 py-2 rounded mt-1"
                                value={product.categoryId}
                                onChange={handleChange}
                            >
                                <option value="">Chọn loại sản phẩm</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name_cate}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Nhà cung cấp */}
                        <div>
                            <label className="block text-gray-700">Nhà cung cấp</label>
                            <select
                                name="brandId"
                                className="w-full border px-4 py-2 rounded mt-1"
                                value={product.brandId}
                                onChange={handleChange}
                            >
                                <option value="">Chọn nhà cung cấp</option>
                                {brands.map(brand => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name_brand}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col items-center mt-6">
                        <div className="w-60 h-60 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center rounded">
                            <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded" />
                                ) : (
                                    "Chọn ảnh"
                                )}
                            </label>
                        </div>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700">Mô tả sản phẩm</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={product.description}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setProduct({ ...product, description: data });
                        }}
                    />
                </div>

                <hr className="my-6 border-gray-300" />


           <hr className="my-6 border-gray-300" />

      
           <div className="mb-4">
                <button type="button" onClick={toggleVariants} className="bg-blue-500 text-white px-4 py-2 rounded">
                   {showVariants ? 'Ẩn' : 'Hiện'}
                </button>
           </div>
           {showVariants && variants.map((variant, index) => (
                <div key={index} className="mb-8">
                    <h3 className="text-md font-semibold mb-4">Biến thể {index + 1}</h3>
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="block text-gray-700">Màu sắc</label>
                            <select
                                name="color"
                                className="w-full border px-4 py-2 rounded mt-1"
                                value={variant.color}
                                onChange={(e) => handleVariantChange(index, e)}
                            >
                                <option value="">Chọn màu sắc</option>
                                {colors.map(color => (
                                    <option key={color.id} value={color.id}>
                                        {color.color_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700">Kích thước</label>
                            <select
                                name="size"
                                className="w-full border px-4 py-2 rounded mt-1"
                                value={variant.size}
                                onChange={(e) => handleVariantChange(index, e)}
                            >
                                <option value="">Chọn kích thước</option>
                                {sizes.map(size => (
                                    <option key={size.id} value={size.id}>
                                        {size.name_size}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700">Giá</label>
                            <input
                                type="number"
                                name="price"
                                className="w-full border px-4 py-2 rounded mt-1"
                                value={variant.price}
                                onChange={(e) => handleVariantChange(index, e)}
                                placeholder="Giá"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700">Số lượng</label>
                            <input
                                type="number"
                                name="quantity"
                                className="w-full border px-4 py-2 rounded mt-1"
                                value={variant.quantity}
                                onChange={(e) => handleVariantChange(index, e)}
                                placeholder="Số lượng"
                            />
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-28 h-28 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center rounded">
                                <label htmlFor={`variant-file-upload-${index}`} className="cursor-pointer text-gray-500">
                                    {variant.previewUrl_variant ? (
                                        <img src={variant.previewUrl_variant} alt="Preview" className="w-full h-full object-cover rounded" />
                                    ) : (
                                        "Chọn ảnh"
                                    )}
                                </label>
                            </div>
                            <input
                                id={`variant-file-upload-${index}`}
                                type="file"
                                className="hidden"
                                onChange={(e) => handleVariantImageChange(index, e)}
                            />
                        </div>

                        <div className="flex justify-start mt-2">
                            <button type="button" className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleRemoveVariant(index)}>
                                Xóa {index + 1}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
                <div className="flex space-x-4 mt-6">
                    <button
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={handleAddVariant}
                    >
                        Thêm biến thể
                    </button>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        disabled={isUploading}
                    >
                        Lưu sản phẩm và biến thể
                    </button>
                </div>

            </form>
        </div>
    );

};

export default CreateProductWithVariants;
