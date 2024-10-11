import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Firebase
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

const UpdateProduct = () => {
    const history = useHistory();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [variants, setVariants] = useState([]);
    const [flashSales, setFlashSales] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [editingVariantId, setEditingVariantId] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        //danh sách sp
        axios.get(`http://localhost:8080/admin/api/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => setProduct(response.data))
            .catch(error => console.error('Error fetching product!', error));
        //thw hiệu
        axios.get('http://localhost:8080/admin/api/brands', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setBrands(response.data))
            .catch(error => console.error('Error fetching brands!', error));
        //danh mục
        axios.get('http://localhost:8080/admin/api/categories', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories!', error));
        //biến thể
        axios.get(`http://localhost:8080/admin/api/variant_products/product/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setVariants(response.data))
            .catch(error => console.error('Error fetching variants!', error));
        //ctgg
        axios.get('http://localhost:8080/admin/api/flashsales', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setFlashSales(response.data))
            .catch(error => console.error('Error fetching flash sales!', error));

        //màu
        axios.get('http://localhost:8080/admin/api/colors', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setColors(response.data))
            .catch(error => console.error('Error fetching colors!', error));
        //kthuoc
        axios.get('http://localhost:8080/admin/api/sizes', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setSizes(response.data))
            .catch(error => console.error('Error fetching sizes!', error));

    }, [id]);
    // Hàm upload ảnh lên Firebase và trả về URL
    const handleImageUpload = async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image!', error);
            throw error;
        }
    };

    const handleProductImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // lưu ảnh vào state
            setPreviewUrl(URL.createObjectURL(file)); // xem trước
        }
    };

    const handleImageChange = (e, variantId) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);

            setVariants(variants.map(variant =>
                variant.id === variantId || variant.id === null
                    ? { ...variant, imageFile: file, imagePreview: previewUrl }
                    : variant
            ));
        }
    };










    //bắt lỗi
    const validateProduct = () => {
        if (!product.nameProd && !product.name_prod) {
            toast.error('Tên sản phẩm không được bỏ trống!');
            return false;
        }
        if (!product.imageProd && !imageFile) {
            toast.error('Hình ảnh sản phẩm không được bỏ trống!');
            return false;
        }
        if (!product.category?.id) {
            toast.error('Loại sản phẩm không được bỏ trống!');
            return false;
        }
        if (!product.brand?.id) {
            toast.error('Nhà cung cấp không được bỏ trống!');
            return false;
        }
        return true;
    };


    const handleAddVariant = () => {

        setVariants([...variants, {
            id: null,
            color: { id: '' },
            size: { id: '' },
            price: '',
            quantity: '',
            image_variant: '',
            flashSale: { id: '' },
            status_VP: 1,
            isNew: true
        }]);
    };



    const uploadImageToFirebase = async () => {
        if (!imageFile) return product.imageProd;

        setUploading(true);
        const storageRef = ref(storage, `images/${imageFile.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, imageFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setUploading(false);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image!', error);
            setUploading(false);
            return product.imageProd;
        }
    };

    //nút lưu to
    // const handleSave = async () => {
    //     if (!validateProduct()) return;

    //     const token = localStorage.getItem('jwtToken');
    //     const imageProd = await uploadImageToFirebase(); //đợia nhr tải lên

    //     const updatedProduct = {
    //         name_prod: product.name_prod || product.nameProd,
    //         description: product.description || '',
    //         image_prod: imageProd, // Cập nhật URL của ảnh mới tải lên
    //         brand: product.brand || {},
    //         category: product.category || {},
    //         status_prod: product.status_prod !== undefined ? product.status_prod : true,
    //     };

    //     try {
    //         // Lưu chi tiết sản phẩm
    //         await axios.put(`http://localhost:8080/admin/api/products/${id}`, updatedProduct, {
    //             headers: { 'Authorization': `Bearer ${token}` }
    //         });


    //         setProduct(updatedProduct);
    //         history.push('/admin/products');
    //         toast.success('Cập nhật sản phẩm thành công!');

    //     } catch (error) {
    //         console.error('Error saving product!', error);
    //         toast.error('Lưu sản phẩm thất bại!');
    //     }
    // };
    //nút lưu to
    const handleSave = async () => {
        if (!validateProduct()) return;

        const token = localStorage.getItem('jwtToken');

        let imageProd;
        try {
            imageProd = await uploadImageToFirebase();
        } catch (error) {
            console.error('Error uploading product image!', error);
            toast.error('Lỗi khi tải ảnh sản phẩm lên!');
            return;
        }

        // Chuẩn bị dữ liệu sản phẩm cần cập nhật
        const updatedProduct = {
            name_prod: product.name_prod || product.nameProd,
            description: product.description || '',
            image_prod: imageProd, // Cập nhật URL của ảnh
            brand: product.brand || {}, // Kiểm tra brand hợp lệ
            category: product.category || {}, // Kiểm tra category hợp lệ
            status_prod: product.status_prod !== undefined ? product.status_prod : true,
        };

        try {
            // Gửi yêu cầu cập nhật sản phẩm tới server
            await axios.put(`http://localhost:8080/admin/api/products/${id}`, updatedProduct, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Chỉ lưu biến thể khi có biến thể
            // if (variants && variants.length > 0) {
            //     await Promise.all(variants.map(variant => handleSaveVariant(variant)));
            // }

            // Thành công
            setProduct(updatedProduct); // Cập nhật lại state
            history.push('/admin/products'); // Chuyển hướng 
            toast.success('Cập nhật sản phẩm thành công!');
        } catch (error) {
            // Xử lý lỗi 
            if (error.response) {
                console.error('Server Error:', error.response.data);
                toast.error(`Lỗi từ máy chủ: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                toast.error('Không nhận được phản hồi từ máy chủ.');
            } else {
                console.error('Client Error:', error.message);
                toast.error(`Lỗi khi gửi yêu cầu: ${error.message}`);
            }
        }
    };


    //nút lưu nhỏ
    // const handleSaveVariant = async (variant) => {

    //     const duplicateVariant = variants.find(v =>
    //         v.color.id.toString() === variant.color.id.toString() &&
    //         v.size.id.toString() === variant.size.id.toString() &&
    //         v.id !== variant.id
    //     );

    //     if (duplicateVariant) {
    //         toast.error('Biến thể với màu sắc và kích thước này đã tồn tại!');
    //         return;
    //     }


    //     if (!variant.color.id) {
    //         toast.error('Màu sắc không được bỏ trống!');
    //         return;
    //     }

    //     if (!variant.size.id) {
    //         toast.error('Kích thước không được bỏ trống!');
    //         return;
    //     }

    //     if (variant.price <= 0) {
    //         toast.error('Giá phải lớn hơn 0!');
    //         return;
    //     }

    //     if (!variant.quantity) {
    //         toast.error('Số lượng không được bỏ trống!');
    //         return;
    //     }

    //     const token = localStorage.getItem('jwtToken');


    //     let imageUrl = variant.image_variant || variant.imagePreview;

    //     // Tải ảnh lên nếu có ảnh mới
    //     if (variant.imageFile) {
    //         const storageRef = ref(storage, `variants/${variant.imageFile.name}`);
    //         try {
    //             const snapshot = await uploadBytes(storageRef, variant.imageFile);
    //             imageUrl = await getDownloadURL(snapshot.ref);
    //         } catch (error) {
    //             console.error('Error uploading variant image!', error);
    //             toast.error('Lỗi khi tải ảnh lên!');
    //             return;
    //         }
    //     }

    //     const updatedVariant = {
    //         ...variant,
    //         image_variant: imageUrl,
    //         product: { id: product.id }
    //     };

    //     try {
    //         if (variant.id) {
    //             // Cập nhật biến thể đã tồn tại
    //             await axios.put(`http://localhost:8080/admin/api/variant_products/${variant.id}`, updatedVariant, {
    //                 headers: { 'Authorization': `Bearer ${token}` }
    //             });

    //             // Cập nhật lại biến thể trong danh sách
    //             setVariants(variants.map(v => v.id === variant.id ? updatedVariant : v));

    //             toast.success('Cập nhật biến thể thành công!');
    //         } else {
    //             // Tạo biến thể mới
    //             const response = await axios.post('http://localhost:8080/admin/api/variant_products', updatedVariant, {
    //                 headers: { 'Authorization': `Bearer ${token}` }
    //             });

    //             // Thêm biến thể mới vào danh sách
    //             setVariants([...variants, { ...updatedVariant, id: response.data.id }]);

    //             toast.success('Thêm biến thể mới thành công!');
    //         }
    //         setEditingVariantId(null);
    //     } catch (error) {
    //         console.error('Error saving variant!', error);
    //         toast.error('Lưu biến thể thất bại!');
    //     }
    // };

    // const handleSaveVariant = async (variant) => {
    //     const duplicateVariant = variants.find(v =>
    //         v.color.id.toString() === variant.color.id.toString() &&
    //         v.size.id.toString() === variant.size.id.toString() &&
    //         v.id !== variant.id
    //     );

    //     if (duplicateVariant) {
    //         toast.error('Biến thể với màu sắc và kích thước này đã tồn tại!');
    //         return;
    //     }

    //     if (!variant.color.id) {
    //         toast.error('Màu sắc không được bỏ trống!');
    //         return;
    //     }

    //     if (!variant.size.id) {
    //         toast.error('Kích thước không được bỏ trống!');
    //         return;
    //     }

    //     if (variant.price <= 0) {
    //         toast.error('Giá phải lớn hơn 0!');
    //         return;
    //     }

    //     if (!variant.quantity) {
    //         toast.error('Số lượng không được bỏ trống!');
    //         return;
    //     }

    //     const token = localStorage.getItem('jwtToken');

    //     let imageUrl = variant.image_variant || variant.imagePreview;

    //     // Tải ảnh lên nếu có ảnh mới
    //     if (variant.imageFile) {
    //         const storageRef = ref(storage, `variants/${variant.imageFile.name}`);
    //         try {
    //             const snapshot = await uploadBytes(storageRef, variant.imageFile);
    //             imageUrl = await getDownloadURL(snapshot.ref);
    //         } catch (error) {
    //             console.error('Error uploading variant image!', error);
    //             toast.error('Lỗi khi tải ảnh lên!');
    //             return;
    //         }
    //     }

    //     // Do not include flashSale if it's not selected
    //     const updatedVariant = {
    //         ...variant,
    //         image_variant: imageUrl,
    //         product: { id: product.id },
    //         flashSale: variant.flashSale?.id ? variant.flashSale : null // Send null if flashSale is not selected
    //     };

    //     try {
    //         if (variant.id) {
    //             // Update existing variant
    //             await axios.put(`http://localhost:8080/admin/api/variant_products/${variant.id}`, updatedVariant, {
    //                 headers: { 'Authorization': `Bearer ${token}` }
    //             });

    //             // Update the variant in the list
    //             setVariants(variants.map(v => v.id === variant.id ? updatedVariant : v));

    //             toast.success('Cập nhật biến thể thành công!');
    //         } else {
    //             // Create new variant
    //             const response = await axios.post('http://localhost:8080/admin/api/variant_products', updatedVariant, {
    //                 headers: { 'Authorization': `Bearer ${token}` }
    //             });

    //             // Add new variant to the list
    //             setVariants([...variants, { ...updatedVariant, id: response.data.id }]);

    //             toast.success('Thêm biến thể mới thành công!');
    //         }
    //         setEditingVariantId(null);
    //     } catch (error) {
    //         // Display detailed error response
    //         if (error.response) {
    //             // The server responded with an error (e.g., 400, 500)
    //             console.error('Server Error:', error.response.data);
    //             toast.error(`Lỗi từ máy chủ: ${error.response.data.message || error.response.statusText}`);
    //         } else if (error.request) {
    //             // The request was made, but no response was received
    //             console.error('No response received:', error.request);
    //             toast.error('Không nhận được phản hồi từ máy chủ.');
    //         } else {
    //             // Something happened while setting up the request
    //             console.error('Client Error:', error.message);
    //             toast.error(`Lỗi khi gửi yêu cầu: ${error.message}`);
    //         }
    //     }
    // };
    const handleSaveVariant = async (variant) => {
        const duplicateVariant = variants.find(v =>
            v.color.id.toString() === variant.color.id.toString() &&
            v.size.id.toString() === variant.size.id.toString() &&
            v.id !== variant.id
        );

        if (duplicateVariant) {
            toast.error('Biến thể với màu sắc và kích thước này đã tồn tại!');
            return;
        }

        if (!variant.color.id) {
            toast.error('Màu sắc không được bỏ trống!');
            return;
        }

        if (!variant.size.id) {
            toast.error('Kích thước không được bỏ trống!');
            return;
        }

        if (variant.price <= 0) {
            toast.error('Giá phải lớn hơn 0!');
            return;
        }

        if (!variant.quantity) {
            toast.error('Số lượng không được bỏ trống!');
            return;
        }

        const token = localStorage.getItem('jwtToken');

        let imageUrl = variant.image_variant || variant.imagePreview;

        // Tải ảnh lên nếu có ảnh mới
        if (variant.imageFile) {
            const storageRef = ref(storage, `variants/${variant.imageFile.name}`);
            try {
                const snapshot = await uploadBytes(storageRef, variant.imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            } catch (error) {
                console.error('Error uploading variant image!', error);
                toast.error('Lỗi khi tải ảnh lên!');
                return;
            }
        }

        const updatedVariant = {
            ...variant,
            image_variant: imageUrl,
            product: { id: product.id },
            flashSale: variant.flashSale?.id ? variant.flashSale : null
        };

        try {
            if (variant.id) {

                await axios.put(`http://localhost:8080/admin/api/variant_products/${variant.id}`, updatedVariant, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Cập nhật biến thể thành công!');
            } else {

                const response = await axios.post('http://localhost:8080/admin/api/variant_products', updatedVariant, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Thêm biến thể mới thành công!');
            }


            const variantsResponse = await axios.get(`http://localhost:8080/admin/api/variant_products/product/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setVariants(variantsResponse.data);

            setEditingVariantId(null); //đặt lại tt
        } catch (error) {
            if (error.response) {
                console.error('Server Error:', error.response.data);
                toast.error(`Lỗi từ máy chủ: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                toast.error('Không nhận được phản hồi từ máy chủ.');
            } else {
                console.error('Client Error:', error.message);
                toast.error(`Lỗi khi gửi yêu cầu: ${error.message}`);
            }
        }
    };


    const handleFieldChange = (variantId, field, value) => {
        setVariants(variants.map(variant => {
            if (variant.id === variantId) {
                if (field === 'flashSale') {

                    if (!value) {
                        return { ...variant, flashSale: null };
                    } else {
                        const selectedFlashSale = flashSales.find(fs => fs.id === value.id);
                        if (selectedFlashSale) {
                            return { ...variant, flashSale: selectedFlashSale };
                        }
                    }
                }
                return { ...variant, [field]: value };
            }
            return variant;
        }));
    };


    const handleEditVariant = (variantId) => {
        setEditingVariantId(variantId);
        setVariants(variants.map(variant =>
            variant.id === variantId ? { ...variant, imagePreview: variant.imageVariant } : variant
        ));
    };

    if (!product) {
        return <div>Loading...</div>;
    }
    const handleDeleteVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Chỉnh sửa sản phẩm: {product.nameProd}</h2>
                <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => history.goBack()}>
                    Quay lại
                </button>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="bg-white p-4 rounded shadow flex">
                <div className="flex-1 pr-4">

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Tên sản phẩm</label>
                        <input
                            type="text"
                            className="w-full border px-4 py-2 rounded"
                            value={product.name_prod || product.nameProd}
                            onChange={e => setProduct({ ...product, name_prod: e.target.value })}
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Loại sản phẩm</label>
                        <select
                            className="w-full border px-4 py-2 rounded"
                            value={product.category?.id || ''}
                            onChange={e => setProduct({ ...product, category: { id: e.target.value } })}
                        >
                            <option value="">Chọn loại sản phẩm</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name_cate}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Nhà cung cấp</label>
                        <select
                            className="w-full border px-4 py-2 rounded"
                            value={product.brand?.id || ''}
                            onChange={e => setProduct({ ...product, brand: { id: e.target.value } })}
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


                <div className="w-1/3">
                    <div className="flex flex-col items-center mt-6">
                        <div className="w-40 h-40 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center rounded">
                            <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded" />
                                ) : product.imageProd ? (
                                    <img src={product.imageProd} alt="Hình sản phẩm" className="max-w-full max-h-full object-contain rounded" />
                                ) : (
                                    "Chọn ảnh"
                                )}
                            </label>
                        </div>

                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleProductImageChange}
                        />

                    </div>
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-gray-700 mb-2">Mô tả sản phẩm</label>
                <CKEditor
                    editor={ClassicEditor}
                    data={product.description || '<p>Nhập mô tả sản phẩm tại đây...</p>'}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setProduct({ ...product, description: data });
                    }}
                />
            </div>

            {/* dsbt*/}
            <div className="bg-white p-4 mt-6 rounded shadow">
                <h3 className="text-lg font-bold mb-4">Biến thể sản phẩm</h3>
                <div className="mb-4">
                    {variants.length > 0 ? (
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 border-b">Hình ảnh</th>
                                    <th className="px-6 py-3 border-b">Màu sắc</th>
                                    <th className="px-6 py-3 border-b">Kích thước</th>
                                    <th className="px-6 py-3 border-b">Giá</th>
                                    <th className="px-6 py-3 border-b">Số lượng</th>
                                    <th className="px-6 py-3 border-b">Flash Sale</th>
                                    <th className="px-6 py-3 border-b">Trạng thái</th>
                                    <th className="px-6 py-3 border-b">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map((variant, index) => (
                                    <tr
                                        key={variant.id || `new-variant-${index}`}
                                        className={variant.isNew ? 'bg-yellow-100' : ''}
                                    >
                                        <td className="px-6 py-4 border-b">
                                            {editingVariantId === variant.id || variant.isNew ? (
                                                <div className="w-16 h-16 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center rounded">
                                                    <label htmlFor={`variant-file-upload-${variant.id || `new-${variant.color.id}-${variant.size.id}`}`} className="cursor-pointer">
                                                        <img
                                                            src={variant.imagePreview || variant.imageVariant || 'placeholder-image-url'}
                                                            alt={variant.description || 'Image'}
                                                            className="w-full h-full object-cover rounded"
                                                        />

                                                    </label>
                                                    <input
                                                        id={`variant-file-upload-${variant.id || `new-${variant.color.id}-${variant.size.id}`}`}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleImageChange(e, variant.id || `new-${variant.color.id}-${variant.size.id}`)}
                                                    />

                                                </div>
                                            ) : (
                                                <img
                                                    src={variant.imageVariant || 'placeholder-image-url'}
                                                    alt={variant.description || 'Image'}
                                                    className="w-16 h-16 object-cover"
                                                />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 border-b">
                                            {editingVariantId === variant.id ? (
                                                <select
                                                    value={variant.color?.id || ''}
                                                    onChange={e => handleFieldChange(variant.id, 'color', { id: e.target.value, colorName: colors.find(c => c.id === e.target.value)?.color_name })}
                                                    className="border rounded px-2 py-1 w-full"
                                                >
                                                    <option value="">Chọn Màu</option>
                                                    {colors.map(color => (
                                                        <option key={color.id} value={color.id}>
                                                            {color.color_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                              <div className='w-15 h-15' style={{backgroundColor: variant.color.colorName}}>.</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 border-b">
                                            {editingVariantId === variant.id ? (
                                                <select
                                                    value={variant.size?.id || ''}
                                                    onChange={e => handleFieldChange(variant.id, 'size', { id: e.target.value, nameSize: sizes.find(s => s.id === e.target.value)?.name_size })}
                                                    className="border rounded px-2 py-1 w-full"
                                                >
                                                    <option value="">Chọn Kích Thước</option>
                                                    {sizes.map(size => (
                                                        <option key={size.id} value={size.id}>
                                                            {size.name_size}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                variant.size.nameSize
                                            )}
                                        </td>

                                        <td className="px-6 py-4 border-b">
                                            {editingVariantId === variant.id ? (
                                                <input
                                                    type="number"
                                                    value={variant.price || 0}
                                                    onChange={e => handleFieldChange(variant.id, 'price', e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            ) : (
                                                variant.price.toLocaleString('vi-VN') + ' đ'
                                            )}
                                        </td>
                                        <td className="px-6 py-4 border-b">
                                            {editingVariantId === variant.id ? (
                                                <input
                                                    type="number"
                                                    value={variant.quantity || 0}
                                                    onChange={e => handleFieldChange(variant.id, 'quantity', e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            ) : (
                                                variant.quantity
                                            )}
                                        </td>
                                        {/* <td className="px-6 py-4 border-b">
                                            {editingVariantId === variant.id ? (
                                                <select
                                                    value={variant.flashSale?.id || ''}
                                                    onChange={e => handleFieldChange(variant.id, 'flashSale', { id: e.target.value, name_FS: flashSales.find(fs => fs.id === e.target.value)?.name_FS })}
                                                    className="border rounded px-2 py-1 w-full"
                                                >
                                                    <option value="">Chọn Flash Sale</option>
                                                    {flashSales.map(flashSale => (
                                                        <option key={flashSale.id} value={flashSale.id}>
                                                            {flashSale.name_FS}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                variant.flashSale
                                                    ? `${variant.flashSale.name_FS} - ${variant.flashSale.id_user || ''}% giảm giá`
                                                    : 'Không có'
                                            )}
                                        </td> */}

                                        <td className="px-6 py-4 border-b">
                                            {editingVariantId === variant.id ? (
                                                <select
                                                    value={variant.flashSale?.id || ''}
                                                    onChange={e => {
                                                        const selectedFlashSaleId = e.target.value;

                                                        if (!selectedFlashSaleId) {

                                                            handleFieldChange(variant.id, 'flashSale', null);
                                                        } else {
                                                            const selectedFlashSale = flashSales.find(fs => fs.id === parseInt(selectedFlashSaleId, 10));


                                                            if (selectedFlashSale) {
                                                                handleFieldChange(variant.id, 'flashSale', {
                                                                    id: selectedFlashSale.id,
                                                                    name_FS: selectedFlashSale.name_FS,
                                                                });
                                                            }
                                                        }
                                                    }}
                                                    className="border rounded px-2 py-1 w-full"
                                                >
                                                    <option value="">No Flash Sale</option>
                                                    {flashSales.map(flashSale => (
                                                        <option key={flashSale.id} value={flashSale.id}>
                                                            {flashSale.name_FS}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                variant.flashSale
                                                    ? `${variant.flashSale.name_FS} - ${variant.flashSale.id_user || ''}% giảm giá`
                                                    : 'Không có'
                                            )}
                                        </td>
                                        {/* bugggg */}
                                        <td className="px-6 py-4 border-b">
                                            {editingVariantId === variant.id ? (
                                                <select
                                                    value={variant.status_VP === 1 ? 1 : 0}
                                                    onChange={e => handleFieldChange(variant.id, 'status_VP', parseInt(e.target.value))}
                                                    className="border rounded px-2 py-1 w-full"
                                                >
                                                    <option value={0}>Ngừng bán</option>
                                                    <option value={1}>Đang bán</option>

                                                </select>
                                            ) : (
                                                variant.statusVP ? 'Đang bán' : 'Ngừng bán'
                                            )}
                                        </td>

                                        <td className="px-6 py-4 border-b">
                                            {editingVariantId === variant.id || variant.isNew ? (
                                                <>
                                                    <button
                                                        className="text-green-500 hover:underline mr-4"
                                                        onClick={() => handleSaveVariant(variant)}
                                                    >
                                                        Lưu
                                                    </button>
                                                    {variant.isNew && (
                                                        <button
                                                            className="text-red-500 hover:underline"
                                                            onClick={() => handleDeleteVariant(index)}
                                                        >
                                                            Xóa
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <button
                                                    className="text-blue-500 hover:underline"
                                                    onClick={() => handleEditVariant(variant.id)}
                                                >
                                                    Chỉnh sửa
                                                </button>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Không có biến thể nào</p>
                    )}
                </div>
                <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleAddVariant}
                >
                    Thêm biến thể
                </button>
            </div>


            <div className="flex space-x-4 mt-6">
                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
                    disabled={uploading}
                >
                    {uploading ? 'Đang tải lên...' : 'Lưu sản phẩm'}
                </button>
            </div>
        </div>
    );
};

export default UpdateProduct;
