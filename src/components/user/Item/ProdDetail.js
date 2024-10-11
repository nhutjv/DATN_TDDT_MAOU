import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../StorageImageText/TxtImageConfig';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

class ProdDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            dataAddToCheckOut: [],
            listVariants: [],
            imageListVariants: [],
            imageProduct: {},
            product: {},
            selectedColorId: null,
            selectedSizeId: null,
            priceVariants: 0,
            availableProducts: 0,
            availableColors: [],
            quantity: 1,
            id_variant: null, // Thêm state để lưu id_variant
        };
        this.handleSizeChange = this.handleSizeChange.bind(this);
        this.imageListVariantsRef = ref(storage, 'images/');
        this.imageProductRef = ref(storage, 'images/');
        this.fetchImageList = this.fetchImageList.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
        this.handleBuyNow = this.handleBuyNow.bind(this);
    }

    handleUpQuantity = () => {
        if (this.state.availableProducts === this.state.quantity) {
            toast.error('Số lượng vượt quá sản phẩm cho phép')
            this.setState({
                quantity: this.state.availableProducts
            })
            return
        } else {
            this.setState({
                quantity: parseInt(this.state.quantity + 1)
            })
        }
    }

    handleDownQuantity = () => {
        this.setState({
            quantity: parseInt(this.state.quantity === 1 ? 1 : this.state.quantity - 1),
        })
    }

    handleInputOnchange = (e) => {
        let value = parseInt(e.target.value);

        if (isNaN(value) || value < 1) {
            value = 1;
            toast.error('Số lượng không thể nhỏ hơn 1');
        } else if (value > this.state.availableProducts) {
            value = this.state.availableProducts;
            toast.error('Số lượng vượt quá sản phẩm sẵn có');
        }

        this.setState({
            quantity: value
        });
    }


    async componentDidMount() {
        if (this.props.match && this.props.match.params) {
            let id = this.props.match.params.id;
            let res = await axios.get(`http://localhost:8080/user/api/variants/${id}`);
            let resProd = await axios.get(`http://localhost:8080/user/api/products1/${id}`);

            console.log(resProd);
            console.log(res)

            const variants = res && res.data ? res.data : [];
            const product = resProd && resProd.data ? resProd.data : {};
            const token = localStorage.getItem('jwtToken')

            localStorage.setItem('name_prod', product.name_prod);
            if (token) {
                const decoded = jwtDecode(token)
                this.setState({ user: decoded });
            }
            this.setState(
                {
                    listVariants: variants,
                    imageProduct: product,
                    product: product,
                },
                () => {
                    if (variants.length > 0) {
                        const firstVariant = variants[0];

                        // Get all available colors from the variants
                        const availableColors = variants
                            .filter((item) => item.quantity > 0)
                            .map((item) => item.color);

                        // Get the size list based on the first color available
                        const availableSizes = variants
                            .filter((item) => item.color.id === firstVariant.color.id && item.quantity > 0)
                            .map((item) => item.size);

                        this.setState({
                            selectedColorId: firstVariant.color.id,
                            availableColors: availableColors,
                            selectedSizeId: availableSizes.length > 0 ? availableSizes[0].id : null,
                            priceVariants: firstVariant.price,
                            availableProducts: firstVariant.quantity,
                            id_variant: firstVariant.id // Lưu id_variant đầu tiên
                        });
                    }
                }
            );

        }
        this.updateProductDetails()
        this.fetchImageList();
    }

    handleColorChange(event) {
        const colorId = event.target.value;
        const { listVariants } = this.state;

        const availableSizes = listVariants
            .filter((item) => item.color.id === parseInt(colorId) && item.quantity > 0)
            .map((item) => item.size);

        this.setState(
            {
                selectedColorId: colorId,
                availableSizes: availableSizes,
                selectedSizeId: availableSizes.length > 0 ? availableSizes[0].id : null,
            },
            this.updateProductDetails
        );
    }

    handleSizeChange(event) {
        const sizeId = event.target.value;
        this.setState(
            {
                selectedSizeId: sizeId,
            },
            this.updateProductDetails
        );
    }

    // async updateProductDetails() {
    //     const { selectedColorId, selectedSizeId, listVariants } = this.state;

    //     if (selectedColorId && selectedSizeId) {
    //         const matchingVariant = listVariants.find(
    //             (item) =>
    //                 item.color.id === parseInt(selectedColorId) && item.size.id === parseInt(selectedSizeId)
    //         );

    //         console.log(matchingVariant)

    //         if (matchingVariant) {
    //             // Gọi API để lấy chiết khấu
    //             const discountRes = await axios.get(`http://localhost:8080/user/api/variants/discount/${matchingVariant.id}`);

    //             const discountPercent = discountRes.data;

    //             this.setState({
    //                 availableProducts: matchingVariant.quantity,
    //                 priceVariants: matchingVariant.price,
    //                 discountPercent, // Cập nhật chiết khấu vào state
    //                 id_variant: matchingVariant.id // Lưu id_variant tương ứng
    //             });
    //         } else {
    //             this.setState({ availableProducts: 0, priceVariants: 0, discountPercent: 0, id_variant: null });
    //         }
    //     }
    // }

    async updateProductDetails() {
        const { selectedColorId, selectedSizeId, listVariants } = this.state;

        if (selectedColorId && selectedSizeId) {
            const matchingVariant = listVariants.find(
                (item) =>
                    item.color.id === parseInt(selectedColorId) && item.size.id === parseInt(selectedSizeId)
            );

            if (matchingVariant) {
                // Gọi API để lấy chiết khấu
                const discountRes = await axios.get(`http://localhost:8080/user/api/variants/discount/${matchingVariant.id}`);
                const discountPercent = discountRes.data;

                this.setState({
                    availableProducts: matchingVariant.quantity,
                    priceVariants: matchingVariant.price,
                    discountPercent, // Cập nhật chiết khấu vào state
                    id_variant: matchingVariant.id, // Lưu id_variant tương ứng
                    imageProduct: { image_prod: matchingVariant.image_variant } // Cập nhật hình ảnh sản phẩm
                });
            } else {
                this.setState({ availableProducts: 0, priceVariants: 0, discountPercent: 0, id_variant: null });
            }
        }
    }


    fetchImageList() {
        listAll(this.imageListVariantsRef).then((response) => {
            const fetchUrls = response.items.map((item) => getDownloadURL(item));
            Promise.all(fetchUrls).then((urls) => {
                this.setState({ imageListVariants: urls });
            });
        });
    }

    async handleAddToCart() {
        const user_id = this.state.user.id_user;
        const token = localStorage.getItem('jwtToken'); // Lấy token từ localStorage

        if (!token) {
            toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
            this.props.history.push('/login');
            return;
        }

        if (!user_id) {
            toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
            this.props.history.push('/login');
            return;
        }

        const { id_variant, quantity } = this.state;

        if (!id_variant) {
            toast.error('Vui lòng chọn kích thước và màu sắc sản phẩm');
            return;
        }

        const data = {
            id_user: user_id,
            id_variant: id_variant,
            quantity: quantity
        };

        try {
            const response = await axios.post('http://localhost:8080/user/api/cartdetail/post', data, {
                headers: {
                    'Authorization': `Bearer ${token}` // Đính kèm token vào yêu cầu
                }
            });
            if (response.status === 200) {
                toast.success('Sản phẩm đã được thêm vào giỏ hàng');
            } else {
                toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
            }
        } catch (error) {
            alert(error);
            if (error.response && error.response.status === 401) {
                // toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
                // this.props.history.push('/login');

            } else {
                toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
            }
        }
    }


    async handleBuyNow() {
        const user_id = this.state.user.id_user;
        const { id_variant, quantity } = this.state;
        const token = localStorage.getItem('jwtToken'); // Get the JWT token from localStorage

        if (!token) {
            toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
            this.props.history.push('/login');
            return;
        }

        if (!user_id) {
            toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
            this.props.history.push('/login');
            return;
        }

        if (!id_variant) {
            toast.error('Vui lòng chọn kích thước và màu sắc sản phẩm');
            return;
        }

        const data = {
            id_user: user_id,
            id_variant: id_variant,
            quantity: quantity
        };

        try {
            const response = await axios.post('http://localhost:8080/user/api/cartdetail/order-direct', data, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include token in the request
                }
            });
            if (response.status === 200) {
                const dulieu = response.data;
                console.log('dulieu to save:', dulieu);

                // Đảm bảo dữ liệu được lưu vào session là một mảng
                sessionStorage.setItem('selectedCartItems', JSON.stringify([dulieu]));
                sessionStorage.setItem('totalPrice', dulieu.discountedPrice * dulieu.quantity);
                this.props.history.push('/checkout');

            } else {
                toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
            }
        } catch (error) {
            alert(error);
            if (error.response && error.response.status === 401) {
                toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
                this.props.history.push('/login');
            } else {
                toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
            }
        }
    }

    render() {
        const { user, listVariants, imageProduct, product,
            availableProducts, priceVariants, selectedSizeId, selectedColorId, availableColors, id_variant, discountPercent
        } = this.state;
        const brand = product.brand || {};
        const category = product.category || {};

        const finalPrice = discountPercent > 0
            ? priceVariants - (priceVariants * discountPercent / 100)
            : priceVariants;


        // Lọc các size có sẵn dựa trên màu đã chọn
        const availableSizes = listVariants
            .filter(item => item.color.id === parseInt(selectedColorId) && item.quantity > 0)
            .map(item => item.size);


        return (
            <>
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-10 lg:p-20 ">
                    {/* Hình ảnh sản phẩm */}
                    <div className="flex flex-col items-center">
                        <div className="w-full md:w-full lg:w-3/4 h-96 overflow-hidden relative group">
                            <img
                                src={imageProduct.image_prod}
                                alt="product"
                                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-125"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-4 w-full md:w-3/4">
                            {/* Hình ban đầu */}
                            <img
                                src={product.image_prod}
                                alt="product default"
                                className="w-full h-24 object-cover cursor-pointer border border-gray-300 hover:border-primary"
                                onClick={() => this.setState({ imageProduct: { image_prod: product.image_prod } })}
                            />

                            {/* Hình biến thể */}
                            {listVariants && listVariants.length > 0 && listVariants.map((item, index) => (
                                <img
                                    key={index}
                                    src={item.image_variant}
                                    alt="product variant"
                                    className="w-full h-24 object-cover cursor-pointer border border-gray-300 hover:border-primary"
                                    onClick={() => this.setState({ imageProduct: { image_prod: item.image_variant } })}
                                />
                            ))}
                        </div>

                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="text-start">
                        <h2 className="text-2xl md:text-3xl font-semibold uppercase mb-4">{product.name_prod}</h2>
                        <div className="space-y-2">
                            <p className="space-x-2">
                                <span className="text-gray-800 font-semibold">Thương hiệu: </span>
                                <span className="text-gray-600">{brand.name_brand}</span>
                            </p>
                            <p className="space-x-2">
                                <span className="text-gray-800 font-semibold">Danh mục: </span>
                                <span className="text-gray-600">{category.name_cate}</span>
                            </p>
                            <p className="space-x-2">
                                <span className="text-gray-800 font-semibold">SKU: </span>
                                <span className="text-gray-600">BE45VGRT</span>
                            </p>
                        </div>

                        {/* Giá sản phẩm */}
                        <div className="flex items-baseline mb-4 space-x-2 font-roboto mt-4">
                            <p className="text-xl text-primary font-semibold">{finalPrice.toLocaleString()} VNĐ</p>
                            <p className="text-base text-gray-400 line-through">{priceVariants.toLocaleString()} VNĐ</p>
                        </div>
                        <p className="mt-4 text-gray-600">
                            ...........................................................................................................................
                        </p>

                        {/* Màu sắc */}
                        <div className="pt-4">
                            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Màu sắc</h3>
                            <div className="flex gap-2">
                                {availableColors && availableColors.length > 0 &&
                                    [...new Map(
                                        availableColors.map((color) => [color.id, color])
                                    ).values()].map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() => this.handleColorChange({ target: { value: color.id } })}
                                            className={`w-10 h-10 border rounded-full focus:outline-none p-1
                        ${selectedColorId === color.id ? 'border-4 border-gray-500' : 'border-2 border-gray-300'}`}
                                            style={{ backgroundColor: '#fff', padding: '2px' }}
                                        >
                                            <div
                                                className="w-full h-full rounded-full"
                                                style={{ backgroundColor: color.color_name }}
                                            ></div>
                                        </button>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Kích thước */}
                        <div className="pt-4">
                            <h3 className="text-xl text-gray-800 font-medium uppercase mb-1">Kích thước</h3>
                            <div className="flex gap-2">
                                {availableSizes && availableSizes.length > 0 &&
                                    availableSizes.map((size) => (
                                        <button
                                            key={size.id}
                                            onClick={() => this.handleSizeChange({ target: { value: size.id } })}
                                            className={`px-4 py-2 border rounded ${selectedSizeId === size.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            {size.name_size}
                                        </button>
                                    ))}
                            </div>
                        </div>



                        {/* Số lượng */}
                        <div className="pt-4">
                            <h3 className="text-xl text-gray-800 font-medium uppercase mb-2">Số lượng</h3>
                            <div className="flex items-center gap-2">
                                <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
                                    <button onClick={this.handleDownQuantity} className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer">
                                        -
                                    </button>
                                    <input onChange={this.handleInputOnchange} type="number" value={this.state.quantity}
                                        className="h-8 w-12 text-center text-gray-900 font-semibold 
                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button onClick={this.handleUpQuantity} className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer">
                                        +
                                    </button>
                                </div>
                                <span className="font-bold text-gray-600">{availableProducts}</span> <span className="text-gray-600">Sản phẩm sẵn có</span>
                            </div>
                        </div>

                        {/* Nút thao tác */}
                        <div className="flex gap-4 mt-6">
                            <button onClick={this.handleAddToCart} className="bg-black text-white px-6 py-2 rounded uppercase hover:bg-transparent hover:text-black border border-black transition">
                                Thêm vào giỏ hàng
                            </button>
                            <button onClick={this.handleBuyNow} className="bg-white text-gray-600 px-6 py-2 rounded uppercase hover:bg-gray-100 border border-gray-300 transition">
                                Đặt Ngay
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{}} className="container justify-center items-center
                 mx-auto md:p-10 lg:p-20">
                    <div className=' px-5 py-5 ms-5 bg-slate-50'>
                        <div className='w-full h-auto px-2 py-2 bg-slate-300 font-bold text-center'>Mô tả sản phẩm</div>
                        <div style={{textAlign: 'left' }} className="m-5 w-full"
                            dangerouslySetInnerHTML={{ __html: product.description }}>
                        </div>
                    </div>
                </div>




            </>
        );
    }
}

export default withRouter(ProdDetail);











