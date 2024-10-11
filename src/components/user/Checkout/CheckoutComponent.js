import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { getDownloadURL, list, listAll, ref } from 'firebase/storage';
import { storage } from '../StorageImageText/TxtImageConfig';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import '../style/Voucher.css'
class CheckoutComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataAddToCheckout: [],
            totalPrice: 0,
            listImageVariants: [],
            delivery_fee: 0,
            selectedPaymentMethod: '',
            fullAddress: '',
            specificAddress: '',
            userAddress: {},
            listAddress: [],
        };
        this.listImageVariants = ref(storage, '/images');
    }

    fetchImageList() {
        listAll(this.listImageVariants).then((response) => {
            const fetchUrls = response.items.map((item) => getDownloadURL(item));
            Promise.all(fetchUrls).then((urls) => {
                this.setState({ listImageVariants: urls });
            });
        });
    }

    calculateShippingFee = () => {
        const { userAddress } = this.state;

        if (!userAddress || !userAddress.id_district || !userAddress.id_ward) {
            toast.error('Chưa có địa chỉ hãy thêm địa chỉ mới!');
            return;
        }

        // lấy danh sách các dịch vụ có sẵn
        axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services', {
            "shop_id": 5144386,
            "from_district": 1454, // Quận của người bán
            "to_district": parseInt(userAddress.id_district) || 0 // Quận của người nhận
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Token': '40890c3a-2e2f-11ef-8ba9-b6fbcb92e37e' // Token GHN
            }
        })
            .then(response => {
                if (response.data.code === 200 && response.data.data.length > 0) {
                    const availableServices = response.data.data;
                    // Chọn gói dịch vụ đầu tiên từ danh sách
                    const selectedService = availableServices[0];

                    // Tính phí vận chuyển với service_id từ dịch vụ hợp lệ
                    const requestData = {
                        from_district_id: 1454,
                        from_ward_code: "21211",
                        service_id: selectedService.service_id,
                        service_type_id: 2,
                        to_district_id: parseInt(userAddress.id_district) || 0,
                        to_ward_code: String(userAddress.id_ward) || "",
                        height: 1,
                        length: 1,
                        weight: 2,
                        width: 1,
                        insurance_value: 0,
                        cod_failed_amount: 0,
                        coupon: null
                    };

                    // request tính phí vận chuyển
                    axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', requestData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Token': '40890c3a-2e2f-11ef-8ba9-b6fbcb92e37e',
                            'ShopId': '5144386'
                        }
                    })
                        .then(response => {
                            if (response.data.code === 200) {
                                let shippingFee = parseInt(response.data.data.total);
                                this.setState({ delivery_fee: shippingFee });
                            } else {
                                toast.error('Lỗi tính phí vận chuyển: ' + response.data.message);
                            }
                        })
                        .catch(error => {
                            toast.error('Có lỗi khi tính phí vận chuyển');
                            console.error(error);
                        });
                } else {
                    toast.error('Không có gói dịch vụ nào khả dụng');
                }
            })
            .catch(error => {
                toast.error('Lỗi khi lấy danh sách dịch vụ: ' + error.message);
                console.error(error);
            });
    };

    handleToAddress(e) {
        e.preventDefault();
        // window.location.reload();

        // Chuyển hướng với query string để focus vào tab "Địa chỉ"
        this.props.history.push('/myprofile?tab=address');


    }

    handlePaymentMethodChange = (event) => {
        this.setState({ selectedPaymentMethod: event.target.id });
    };

    componentDidMount() {
        const token = localStorage.getItem('jwtToken');
        const data = sessionStorage.getItem('selectedCartItems');
        const totalPrice = sessionStorage.getItem('totalPrice');
        // console.log(token)
        // Kiểm tra xem checkoutElement có được lấy từ sessionStorage không
        const storedCheckoutElement = sessionStorage.getItem('checkoutElement');
        const extractToken = jwtDecode(token)
        // console.log(extractToken.id_user)
        console.log("du lieu : ", JSON.parse(data))
        this.setState({
            dataAddToCheckout: JSON.parse(data) && JSON.parse(data) !== null ? JSON.parse(data) : '',
            totalPrice: totalPrice || 0,
            checkoutElement: storedCheckoutElement ? JSON.parse(storedCheckoutElement) : null,  // Gán checkoutElement nếu có
        }, () => {
            console.log('State checkoutElement sau khi cập nhật:', this.state.checkoutElement);
            console.log(this.state.checkoutElement);

            // const { checkoutElement } = this.state;

            axios.get(`http://localhost:8080/user/api/address/getAddress/${extractToken.id_user}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            ).then(response => {
                this.setState({
                    userAddress: response.data
                }, () => {
                    this.calculateShippingFee();
                });
            }).catch(error => {
                console.error('Error fetching address:', error);
            });

            this.setState({
                dataAddToCheckout: JSON.parse(data) && JSON.parse(data) !== null ? JSON.parse(data) : '',
                totalPrice: totalPrice || 0,
            });

            this.fetchImageList();

            // Kiểm tra xem có tham số phản hồi từ VNPay hay không
            const params = new URLSearchParams(window.location.search);
            const vnp_ResponseCode = params.get('vnp_ResponseCode');

            //ma trang thai
            const vnp_TransactionStatus = params.get('vnp_TransactionStatus');

            //ma thanh toan
            const vnp_TransactionNo = params.get('vnp_TransactionNo');
            console.log('VNPay response params:', Array.from(params.entries()));

            //Chỉ xử lý nếu vnp_ResponseCode có tồn tại
            if (vnp_ResponseCode) {
                this.handleVNPayResponse(vnp_ResponseCode, vnp_TransactionStatus, vnp_TransactionNo, token);
            }

        });
    }



    // Tách hàm xử lý phản hồi VNPay
    handleVNPayResponse(vnp_ResponseCode, vnp_TransactionStatus, vnp_TransactionNo, token) {
        console.log('VNPay response params:', vnp_ResponseCode, vnp_TransactionStatus, vnp_TransactionNo);

        if (vnp_ResponseCode === '00') {
            const updatedCheckoutElement = {
                ...this.state.checkoutElement,  // Dữ liệu đã có sẵn trong checkoutElement
                vnp_TransactionStatus,  // Thêm mã trạng thái giao dịch
                vnp_TransactionNo  // Thêm mã thanh toán
            };
            axios.post('http://localhost:8080/user/api/order/createbyvnpay', updatedCheckoutElement, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Order placed successfully after VNPay:', response.data);
                    toast.success('Đặt hàng thành công');
                    sessionStorage.removeItem('selectedCartItems');
                    sessionStorage.setItem('datasucess', JSON.stringify(response.data));
                    sessionStorage.removeItem('totalPrice');
                    sessionStorage.removeItem('checkoutElement');
                    this.setState({ dataAddToCheckout: [], totalPrice: 0 });
                    this.props.history.push('/success');
                })
                .catch(error => {
                    console.error('Error placing order after VNPay:', error);
                    toast.error('Đặt hàng thất bại');
                });
        } else {
            const updatedCheckoutElement = {
                ...this.state.checkoutElement,  // Dữ liệu đã có sẵn trong checkoutElement
                vnp_TransactionStatus,  // Thêm mã trạng thái giao dịch
                vnp_TransactionNo  // Thêm mã thanh toán
            };
            axios.post('http://localhost:8080/user/api/order/createbyvnpay', updatedCheckoutElement, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Order placed successfully after VNPay:', response.data);
                    toast.error('Thanh toán không thành công');
                    // sessionStorage.removeItem('selectedCartItems'); 
                    // sessionStorage.setItem('datasucess', JSON.stringify(response.data));
                    // sessionStorage.removeItem('totalPrice');
                    // sessionStorage.removeItem('checkoutElement');
                    // this.setState({ dataAddToCheckout: [], totalPrice: 0 });
                    // this.props.history.push('/success');
                })
                .catch(error => {
                    console.error('Error placing order after VNPay:', error);
                    toast.error('Đặt hàng thất bại');
                });

        }
    }

    handlePlaceOrder = () => {
        const token = localStorage.getItem('jwtToken');
        const { dataAddToCheckout, totalPrice, delivery_fee, selectedPaymentMethod, userAddress } = this.state;
        console.log("data add to check out: ", dataAddToCheckout)

        if (selectedPaymentMethod === '') {
            toast.error('Vui lòng chọn phương thức thanh toán')
            return
        }

        if (userAddress === '') {
            toast.error('Vui lòng kiểm tra địa chỉ')
            return
        }

        const checkoutElement = {
            items: dataAddToCheckout,
            totalPrice: parseInt(totalPrice) + parseInt(delivery_fee),
            deliveryFee: delivery_fee,
            address: userAddress.id,
            paymentMethod: selectedPaymentMethod,
            state: 1
        };



        if (selectedPaymentMethod === "2") {  // Thanh toán qua VNPay
            axios.post('http://localhost:8080/user/api/payment', {
                amount: checkoutElement.totalPrice,
                orderType: 'billpayment',
                returnUrl: 'http://localhost:3000/checkout'  // Trở về trang checkout sau khi thanh toán VNPay
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                if (response.data) {
                    this.setState({ checkoutElement: checkoutElement }, () => {
                        sessionStorage.setItem('checkoutElement', JSON.stringify(checkoutElement));  // Lưu checkoutElement vào sessionStorage
                        window.location.href = response.data;  // Chuyển hướng tới URL thanh toán của VNPay
                    });
                } else {
                    toast.error('Lỗi tạo URL thanh toán');
                }
            }).catch(error => {
                console.error('Error creating payment URL:', error);
                toast.error('Đặt hàng thất bại');
            });
        } else {
            axios.post('http://localhost:8080/user/api/order/create', checkoutElement, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Order placed successfully:', response.data);
                    toast.success('Đặt hàng thành công');
                    sessionStorage.setItem('datasucess', JSON.stringify(response.data));
                    sessionStorage.removeItem('selectedCartItems');
                    sessionStorage.removeItem('totalPrice');
                    this.setState({ dataAddToCheckout: [], totalPrice: 0 });
                    this.props.history.push('/success');
                })
                .catch(error => {
                    console.error('There was an error placing the order:', error);
                    toast.error('Đặt hàng thất bại');
                });
        }
    };

    handleLoadAddressByUserId() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token)
            const id_user = decoded.id_user
            axios.get(`http://localhost:8080/user/api/address/list/${id_user}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Đính kèm token vào yêu cầu
                    }
                }
            ).then(response => {
                this.setState({
                    listAddress: response && response.data ? response.data : []
                })
            })
        }
    }

    handleChangeAddress(id_address) {
        const token = localStorage.getItem('jwtToken')
        axios.get(`http://localhost:8080/user/api/address/byid/${id_address}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}` // Đính kèm token vào yêu cầu
                }
            }
        ).then(response => {
            this.setState({
                userAddress: response.data
            }, () => {
                this.calculateShippingFee();
            })
        })
        console.log(this.state.userAddress)
    }

    render() {
        const { dataAddToCheckout, totalPrice, delivery_fee, userAddress, listAddress, selectedPaymentMethod } = this.state;
        console.log(dataAddToCheckout)
        const totalPriceFormatted = isNaN(parseInt(totalPrice)) ? 0 : parseInt(totalPrice);
        const deliveryFeeFormatted = isNaN(parseInt(delivery_fee)) ? 0 : parseInt(delivery_fee);
        const totalAmount = totalPriceFormatted + deliveryFeeFormatted;


        const Coupon = ({ discount, maxDiscount, minOrder, validity, conditions }) => (
            <div className="flex items-center border rounded-lg shadow-md p-4 mb-4">
                <div className="bg-red-500 w-24 h-24 flex-shrink-0 rounded-l-lg relative">
                    <div className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 bg-white rounded-full"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div className="flex-grow p-4">
                    <div className="text-lg font-semibold">{discount} Giảm tối đa {maxDiscount}</div>
                    <div className="text-sm text-gray-600">Đơn Tối Thiểu {minOrder}</div>
                    <div className="text-sm text-gray-600 flex items-center mt-2">
                        <i className="far fa-clock mr-1"></i> Có hiệu lực sau: {validity} <a href="#" className="text-blue-500 ml-2">{conditions}</a>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-red-100 text-red-500 text-xs rounded-full px-2 py-1 mb-2">x2</div>
                    <button className="border border-red-500 text-red-500 rounded px-4 py-1">Dùng Sau</button>
                </div>
            </div>
        );

        return (
            <>
                <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
                    <button href="#" className="text-2xl font-bold text-gray-800">sneekpeeks</button>
                    <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base"></div>
                </div>

                <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
                    <div className="px-4 pt-8">
                        <div className="grid lg:grid-cols-2 ">
                            <div>
                                <p className="text-xl font-medium">Thông tin đơn hàng</p>
                                <p className="text-gray-400">Kiểm tra sản phẩm và lựa chọn phương thức thanh toán.</p>
                            </div>
                            <div className='block sm:mx-28 w-full'>

                                {/* <!-- Button trigger modal --> */}
                                <button
                                    type="button"
                                    class="inline-block bg-red-400 rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                    data-twe-toggle="modal"
                                    data-twe-target="#exampleModal"
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light">
                                    Sử dụng phiếu giảm giá
                                </button>

                            </div>
                        </div>


                        {/* <div
                            className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                            {dataAddToCheckout && dataAddToCheckout.length > 0 && dataAddToCheckout !== null ?
                                dataAddToCheckout.map((item, index) => (
                                    <div className="flex flex-col rounded-lg bg-white sm:flex-row" key={index}>
                                        <img className="m-2 h-24 w-28 rounded-md border object-cover object-center" src={item.variantProduct.image_variant} alt="" />
                                        <div className="flex text-start ms-10 w-full flex-col px-4 py-4">
                                            <span className="font-semibold"> {item.variantProduct.product.name_prod} - {item.variantProduct.size.name_size} </span>
                                            <span ><div className='w-24 h-24' style={{backgroundColor: item.variantProduct.color.color_name}}></div></span>
                                            <span className="float-right text-gray-400">
                                                Số lượng: {item.quantity}
                                            </span>
                                            <p className="text-lg font-bold">{(item.quantity * item.discountedPrice).toLocaleString()} đ</p>

                                        </div>

                                    </div>

                                ))
                                :
                                <div>Đơn hàng đang trống</div>
                            }
                        </div> */}

                        <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                            {dataAddToCheckout && dataAddToCheckout.length > 0 && dataAddToCheckout !== null ? (
                                dataAddToCheckout.map((item, index) => (
                                    <div className="flex flex-col rounded-lg bg-white sm:flex-row" key={index}>
                                        <img
                                            className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                                            src={item.variantProduct.image_variant}
                                            alt=""
                                        />
                                        <div className="flex text-start ms-10 w-full flex-col px-4 py-4">
                                            <div className="flex items-center">
                                                <span className="font-semibold">
                                                    {item.variantProduct.product.name_prod} - Kích thước: {item.variantProduct.size.name_size} - Màu
                                                </span>
                                                <div
                                                    className="w-6 h-6 ml-4 rounded-full border"
                                                    style={{ backgroundColor: item.variantProduct.color.color_name }}
                                                ></div>
                                            </div>
                                            <span className="float-right text-gray-400">Số lượng: {item.quantity}</span>
                                            <p className="text-lg font-bold">{(item.quantity * item.discountedPrice).toLocaleString()} đ</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>Đơn hàng đang trống</div>
                            )}
                        </div>

                    </div>
                    <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                        <p className="text-xl font-medium">Chi tiết thanh toán</p>
                        <p className="text-gray-400">Vui lòng hoàn thành thông tin đơn hàng của bạn</p>
                        <div>
                            {!userAddress || !userAddress.id_district || !userAddress.id_ward ?
                                <button
                                    onClick={(e) => this.handleToAddress(e)}
                                    type="button"
                                    className="text-red-400 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-zinc-400"
                                >
                                    Thêm địa chỉ mới tại đây
                                </button>
                                :
                                <>
                                    <span>
                                        <label htmlFor="billing-address" className="text-start mt-4 mb-2 text-sm font-medium me-5">Địa chỉ giao hàng</label>
                                    </span>
                                    <span>
                                        <label htmlFor="billing-address" className="text-start text-red-400 mt-4 mb-2 text-sm font-medium">
                                            {/* <!-- Button trigger modal --> */}
                                            <button
                                                onClick={() => this.handleLoadAddressByUserId()}
                                                type="button"
                                                className="text-red-400 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-zinc-400"
                                                data-twe-toggle="modal"
                                                data-twe-target="#exampleModalTips2"
                                                data-twe-ripple-init
                                                data-twe-ripple-color="light">
                                                Thay doi
                                            </button>
                                        </label>
                                    </span>
                                </>
                            }

                            <div className="w-full">
                                {userAddress.user && (
                                    <span className='font-bold '>
                                        {userAddress.user.phone}
                                    </span>
                                )}
                                <span> {userAddress.full_address}</span>
                            </div>
                            <div>
                                <p className="mt-8 text-lg font-medium">Phương thức thanh toán</p>
                                <form className="mt-5 grid gap-6">
                                    <div className="relative">
                                        <input className="peer hidden" id="1" type="radio" name="radio" onChange={this.handlePaymentMethodChange} />
                                        <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                                        <label className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" htmlFor="1">
                                            <img className="w-14 object-contain" src="https://cdn-icons-png.flaticon.com/512/2897/2897855.png" alt="" />
                                            <div className="ml-5">
                                                <span className="mt-2 font-semibold">Thanh toán khi nhận hàng</span>
                                                <p className="text-slate-500 text-sm leading-6">bạn sẽ trả tiền trực tiếp cho người giao hàng khi nhận được sản phẩm.</p>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input className="peer hidden" id="2" type="radio" name="radio" onChange={this.handlePaymentMethodChange} />
                                        <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                                        <label className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" htmlFor="2">
                                            <img className="w-14 object-contain" src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png" alt="" />
                                            <div className="ml-5">
                                                <span className="mt-2 font-semibold">Thanh Toán Qua Ngân Hàng</span>
                                                <p className="text-slate-500 text-sm leading-6">chuyển tiền ngân hàng đến tài khoản của người bán để thanh toán.</p>
                                            </div>
                                        </label>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="mt-6 border-t border-b py-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Tạm tính:</p>
                                <p className="font-semibold text-gray-900">{totalPriceFormatted.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Phí vận chuyển:</p>
                                <p className="font-semibold text-gray-900">{deliveryFeeFormatted.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Tổng tiền cần phải thanh toán: </p>
                            <p className="text-2xl font-semibold text-gray-900">{totalAmount.toLocaleString()}</p>
                        </div>

                        <button onClick={this.handlePlaceOrder} className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">Đặt hàng</button>
                    </div>
                </div>

                {/* <!-- Modal --> */}
                <div
                    data-twe-modal-init
                    class="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                    id="exampleModalTips2"
                    tabindex="-1"
                    aria-labelledby="exampleModalTipsLabel"
                    aria-hidden="true">
                    <div
                        data-twe-modal-dialog-ref
                        class="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[600px]">
                        <div
                            class="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
                            <div
                                class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 p-4 dark:border-white/10">
                                <h5
                                    class="text-xl font-medium leading-normal text-surface dark:text-white"
                                    id="exampleModalTipsLabel">
                                    Đổi địa chỉ đặt hàng
                                </h5>
                            </div>
                            <div
                                class="relative flex-auto p-4 text-start"
                                data-twe-modal-body-ref>
                                {listAddress && listAddress.length > 0
                                    && listAddress.map((item, index) => {
                                        return (
                                            <>
                                                <h5 class="mb-2 text-xl font-bold">
                                                    {item.user.phone}
                                                </h5>
                                                <div class="flex justify-between items-center">
                                                    <div class="truncate max-w-[70%]">
                                                        {item.full_address}
                                                    </div>
                                                    <button
                                                        onClick={() => this.handleChangeAddress(item.id)}
                                                        type="button"
                                                        class="ms-4 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400"
                                                        data-twe-toggle="popover"
                                                        data-twe-title="Popover title"
                                                        data-twe-content="Popover body content is set in this attribute."
                                                        data-twe-ripple-init
                                                        data-twe-ripple-color="light">
                                                        Thay đổi
                                                    </button>
                                                </div>

                                                <hr class="my-4 dark:border-neutral-500" />
                                            </>
                                        )
                                    }
                                    )}
                            </div>
                            <div
                                class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 p-4 dark:border-white/10">
                                <button
                                    type="button"
                                    class="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400"
                                    data-twe-modal-dismiss
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light">
                                    ĐÓNG
                                </button>
                            </div>
                        </div>
                    </div>
                </div>



                {/* <!-- Modal --> */}
                <div
                    data-twe-modal-init
                    class="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                    id="exampleModal"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div
                        data-twe-modal-dialog-ref
                        class="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[800px]">
                        <div
                            class="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
                            <div
                                class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 p-4 dark:border-white/10">
                                <h5
                                    class="text-xl font-medium leading-normal text-surface dark:text-white"
                                    id="exampleModalLabel">
                                    Modal title
                                </h5>
                                <button
                                    type="button"
                                    class="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                                    data-twe-modal-dismiss
                                    aria-label="Close">
                                    <span class="[&>svg]:h-6 [&>svg]:w-6">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor">
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </span>
                                </button>
                            </div>

                            {/* Modal body with scroll */}
                            <div class="relative flex-auto p-4 max-h-[500px] overflow-y-auto" data-twe-modal-body-ref>
                                {/* Voucher Section */}
                                <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                                    <div className="p-4">
                                        <Coupon
                                            discount="Giảm 8%"
                                            maxDiscount="₫35k"
                                            minOrder="₫250k"
                                            validity="1 ngày"
                                            conditions="Điều Kiện"
                                        />
                                        <Coupon
                                            discount="Giảm 10%"
                                            maxDiscount="₫30k"
                                            minOrder="₫250k"
                                            validity="1 ngày"
                                            conditions="Điều Kiện"
                                        />
                                        <Coupon
                                            discount="Giảm 10%"
                                            maxDiscount="₫30k"
                                            minOrder="₫250k"
                                            validity="1 ngày"
                                            conditions="Điều Kiện"
                                        />
                                        <Coupon
                                            discount="Giảm 10%"
                                            maxDiscount="₫30k"
                                            minOrder="₫250k"
                                            validity="1 ngày"
                                            conditions="Điều Kiện"
                                        />
                                        <Coupon
                                            discount="Giảm 10%"
                                            maxDiscount="₫30k"
                                            minOrder="₫250k"
                                            validity="1 ngày"
                                            conditions="Điều Kiện"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal footer */}
                            <div
                                class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 p-4 dark:border-white/10">
                                <button
                                    type="button"
                                    class="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400"
                                    data-twe-modal-dismiss
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light">
                                    Close
                                </button>
                                <button
                                    type="button"
                                    class="ms-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light">
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}

export default withRouter(CheckoutComponent);
