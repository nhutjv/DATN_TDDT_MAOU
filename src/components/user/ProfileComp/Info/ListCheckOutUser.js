import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode'; // Đã sửa đúng cách import
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../../StorageImageText/TxtImageConfig';
import { withRouter } from 'react-router-dom';
const api = axios.create({
    baseURL: 'http://localhost:8080'
});

class ListCheckOutUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCheck: [],
            filteredOrders: [],
            dataOrderDetail: {}, // Thay đổi: lưu chi tiết đơn hàng theo orderId
            imageListVariants: [],
            user: {},
            activeTab: 'all',
            expandedOrders: [],
            currentPage: 1, // Quản lý trang hiện tại
            itemsPerPage: 2, // Số lượng phần tử mỗi trang
            selectedReason: '',
            id_order: '',
        };
        this.imageListVariantsRef = ref(storage, 'variant-images/');
        this.fetchImageList = this.fetchImageList.bind(this);
    }

    async componentDidMount() {
        try {
            const token = localStorage.getItem('jwtToken');
            const decoded = jwtDecode(token);
            console.log(decoded);
            if (token) {
                const decoded = jwtDecode(token);
                this.setState({ user: decoded });
                console.log(this.state.user);
                const dataCheckOut = await api.get(`/user/api/order/all/${decoded.id_user}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Đính kèm token vào yêu cầu
                    }
                });

                // Sắp xếp đơn hàng theo thời gian mới nhất
                const sortedOrders = dataCheckOut.data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
                console.log(dataCheckOut)
                this.setState({
                    dataCheck: sortedOrders,
                    filteredOrders: sortedOrders
                });
            } else {
                alert('Error: No token found');
            }
            this.fetchImageList();
        } catch (error) {

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

    formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds} ngày ${day}/${month}/${year}`;
    };

    // Lọc đơn hàng theo tab
    handleTabChange = (status) => {
        if (status === 'all') {
            this.setState({ filteredOrders: this.state.dataCheck, activeTab: 'all', currentPage: 1 });
        } else {
            const filtered = this.state.dataCheck.filter(order => order.state.name_status_order === status);
            this.setState({ filteredOrders: filtered, activeTab: status, currentPage: 1 });
        }
    };

    // Hiển thị/Ẩn chi tiết đơn hàng
    // toggleOrderDetails = async (orderId) => {
    //     const { expandedOrders, dataOrderDetail } = this.state;

    //     if (expandedOrders.includes(orderId)) {
    //         // Đóng chi tiết đơn hàng
    //         this.setState({
    //             expandedOrders: expandedOrders.filter(id => id !== orderId)
    //         });
    //     } else {
    //         // Mở chi tiết đơn hàng
    //         if (!dataOrderDetail[orderId]) {
    //             // Nếu chưa có chi tiết đơn hàng trong state, tải từ API
    //             const token = localStorage.getItem('jwtToken');
    //             try {
    //                 const dataDetail = await api.get(`/user/api/order-details/orderDetail/${orderId}`, {
    //                     headers: {
    //                         'Authorization': `Bearer ${token}` // Đính kèm token vào yêu cầu
    //                     }
    //                 });
    //                 this.setState((prevState) => ({
    //                     expandedOrders: [...prevState.expandedOrders, orderId],
    //                     dataOrderDetail: {
    //                         ...prevState.dataOrderDetail,
    //                         [orderId]: dataDetail.data // Lưu chi tiết đơn hàng theo orderId
    //                     }
    //                 }));
    //             } catch (error) {
    //                 console.error('Error fetching order details:', error);
    //             }
    //         } else {
    //             // Nếu đã có chi tiết đơn hàng trong state, chỉ cần mở
    //             this.setState((prevState) => ({
    //                 expandedOrders: [...prevState.expandedOrders, orderId]
    //             }));
    //         }
    //     }
    // };

    toggleOrderDetails = async (orderId) => {
        const { expandedOrders, dataOrderDetail } = this.state;

        if (expandedOrders.includes(orderId)) {

            this.setState({
                expandedOrders: expandedOrders.filter(id => id !== orderId)
            });
        } else {
            if (!dataOrderDetail[orderId]) {
                const token = localStorage.getItem('jwtToken');
                try {
                    const dataDetail = await api.get(`/user/api/order-details/orderDetail/${orderId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log(dataDetail);
                    this.setState((prevState) => ({
                        expandedOrders: [...prevState.expandedOrders, orderId],
                        dataOrderDetail: {
                            ...prevState.dataOrderDetail,
                            [orderId]: dataDetail.data
                        }
                    }));
                } catch (error) {
                    console.error('Error fetching order details:', error);
                }
            } else {
                this.setState((prevState) => ({
                    expandedOrders: [...prevState.expandedOrders, orderId]
                }));
            }
        }
    };


    handleAcceptCancelOrder = async () => {
        const { id_order, selectedReason } = this.state;
        console.log(`Cancelling order: ${id_order}, Reason: ${selectedReason}`);

        const token = localStorage.getItem('jwtToken');

        try {
            // Tạo payload chứa selectedReason
            const payload = {
                reason: selectedReason
            };

            await api.put(`/user/api/order/cancel/${id_order}`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' // Chỉ rõ loại dữ liệu gửi đi
                }
            });


            toast.success('Hủy đơn thành công');
            // Navigate to the "Order History" tab (tab = 'order' based on your tab system)

            // Cập nhật trạng thái đơn hàng sau khi hủy

            this.setState((prevState) => ({
                dataCheck: prevState.dataCheck.map(order =>
                    order.id === id_order ? { ...order, state: { id: 6, name_status_order: 'Canceled' } } : order
                )
            }));

            this.componentDidMount(); // Cập nhật lại danh sách đơn hàng

        } catch (error) {
            toast.error('Lỗi hủy đơn');
            console.error('Cancellation error:', error);
        }
    };


    handleCancelOrder = async (id) => {
        this.setState({
            id_order: id
        })
    };

    // Chuyển trang
    paginate = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    };

    handleReasonChange = (event) => {
        const selectedReason = event.target.value;
        this.setState({ selectedReason });
        console.log('Lý do hủy đơn:', selectedReason);
    };

    render() {
        const { filteredOrders, currentPage, itemsPerPage, activeTab, expandedOrders, dataOrderDetail } = this.state;
        console.log(dataOrderDetail)
        const reasons = [
            'Đặt nhầm sản phẩm',
            'Sản phẩm giao quá trễ',
            'Tìm thấy giá rẻ hơn',
            'Thay đổi ý định',
            'Lý do khác',
        ];

        // Tính toán chỉ số phần tử của trang hiện tại
        const indexOfLastOrder = currentPage * itemsPerPage;
        const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
        const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

        // Tổng số trang
        const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

        return (
            <div className="container mx-auto px-4 py-0 my-0">
                {/* Tabs */}
                <div className="tabs mb-6 flex flex-wrap justify-center space-x-4 space-y-2 md:space-y-0">
                    {['Tất cả', 'Đang chờ xử lý', 'Đã xác nhận', 'Đang giao hàng', 'Đã giao'].map((status) => (
                        <button
                            key={status}
                            className={`py-2 px-4 rounded-lg ${activeTab === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => this.handleTabChange(status === 'Tất cả' ? 'all' : status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Kiểm tra nếu không có dữ liệu */}
                {filteredOrders.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-lg font-semibold uppercase text-gray-500">KHÔNG CÓ ĐƠN HÀNG</p>
                    </div>
                ) : (
                    /* Nếu có dữ liệu, hiển thị danh sách đơn hàng */
                    <div className="order-list space-y-6">
                        {currentOrders.map((item) => (
                            <div key={item.id} className="order-item bg-white p-6 rounded-lg shadow-md mx-auto max-w-4xl">
                                <div className="order-info flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-lg">
                                            {item.methodPayment.name_method === 'COD' ? 'Thanh toán khi giao hàng' : 'Thanh toán Online'}
                                        </div>
                                        <div className="text-sm text-gray-600">Trạng thái:
                                            <span className='ms-1 text-lg text-red-600'>
                                                {item.state.name_status_order}
                                            </span>
                                        </div>

                                        {item.state.id === 6 &&
                                            <div className="text-sm text-gray-600">
                                                Lí do: {item.note}
                                            </div>
                                        }

                                        <div className="text-sm text-gray-600">Ngày đặt: {this.formatDate(item.created_date)}</div>
                                        <div className="text-sm text-gray-600">Phí vận chuyển: {item.delivery_fee.toLocaleString()} đ</div>
                                        <div className="text-sm font-semibold text-gray-900">Tổng tiền: {item.total_cash.toLocaleString()} đ</div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                                            onClick={() => this.toggleOrderDetails(item.id)}
                                        >
                                            {expandedOrders.includes(item.id) ? 'Ẩn' : 'Chi tiết'}
                                        </button>
                                        {item.state.id === 1 && (
                                            <button type="button"
                                                onClick={() => this.handleCancelOrder(item.id)}
                                                class="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                                                data-twe-toggle="modal"
                                                data-twe-target="#exampleModal5"
                                                data-twe-ripple-init
                                                data-twe-ripple-color="light">
                                                Hủy đơn hàng
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Hiển thị chi tiết đơn hàng nếu có trong expandedOrders và có dataOrderDetail tương ứng */}
                                {/* {
                                    expandedOrders.includes(item.id) && dataOrderDetail[item.id] ? (
                                        dataOrderDetail[item.id].map((detail, idx) => (
                                            <div key={idx} className="text-sm mt-2 flex items-center space-x-10">
                                                <img
                                                    src={detail.variantProd.image_variant}
                                                    alt=""
                                                    className="w-28 h-28 object-cover rounded-lg border"
                                                />
                                                <div className="flex flex-col space-y-2">
                                                    <span className="font-bold text-lg">
                                                        Tên mặt hàng: {detail.variantProd.product.name_prod}
                                                    </span>
                                                    Màu
                                                    <div className="w-7 h-7 rounded-full" style={{backgroundColor: detail.variantProd.color.color_name}}>.</div>
                                                    <p className="font-semibold text-gray-700">
                                                        Số lượng: {detail.quantity} - Đơn giá: {detail.variantProd.price.toLocaleString()} đ - (Tạm tính: {(parseInt(detail.quantity) * parseInt(detail.variantProd.price)).toLocaleString()} đ)
                                                    </p>
                                                    <p className="text-base text-gray-700">
                                                        Phí vận chuyển: {detail.order.delivery_fee.toLocaleString()} đ
                                                    </p>
                                                    <p className="text-base font-semibold text-gray-900">
                                                        Tổng cộng: {
                                                            (parseInt(detail.quantity) * parseInt(detail.variantProd.price)
                                                            + parseInt(detail.order.delivery_fee)).toLocaleString() 
                                                            } đ
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm mt-2"></div>
                                    )
                                } */}
                                {
                                    expandedOrders.includes(item.id) && dataOrderDetail[item.id] ? (
                                        dataOrderDetail[item.id].map((detail, idx) => (
                                            <>
                                                <div key={idx} className="text-sm mt-2 flex items-center space-x-10">
                                                    <img
                                                        src={detail.variantProduct.image_variant}
                                                        alt=""
                                                        className="w-28 h-28 object-cover rounded-lg border"
                                                    />
                                                    <div className="flex flex-col space-y-2">
                                                        <span className="font-bold text-lg">
                                                            Tên mặt hàng: {detail.variantProduct.product.name_prod}
                                                        </span>
                                                        <p>Màu:
                                                            <div className="w-7 h-7 rounded-full" style={{ backgroundColor: detail.variantProduct.color.color_name }}></div>
                                                        </p>
                                                        <p className="font-semibold text-gray-700">
                                                            Số lượng: {detail.quantity} - Đơn giá: {detail.variantProduct.price.toLocaleString()} đ
                                                            {detail.discount > 0 && (
                                                                <span className='ms-3 px-2 py-3 rounded-full bg-red-400'> - Giảm giá: {detail.discount}% - Giá sau giảm: {detail.discountedPrice.toLocaleString()} đ</span>
                                                            )}
                                                        </p>
                                                        {/* <p className="text-base text-gray-700">
                        Phí vận chuyển: {detail.order.delivery_fee.toLocaleString()} đ
                    </p> */}
                                                        <p className="text-base font-semibold text-gray-900">
                                                            Tổng cộng: {(parseInt(detail.quantity) * parseInt(detail.discountedPrice)).toLocaleString()} đ
                                                        </p>

                                                    </div>

                                                </div>
                                                <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                                            </>
                                        ))
                                    ) : (
                                        <div className="text-sm mt-2"></div>
                                    )
                                }

                            </div>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination flex justify-center mt-4">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => this.paginate(index + 1)}
                                        className={`py-2 px-4 mx-1 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )
                }
                {/* <!-- Modal --> */}
                <div
                    data-twe-modal-init
                    className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                    id="exampleModal5"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div
                        data-twe-modal-dialog-ref
                        className="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]"
                    >
                        <div className="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
                            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 p-4 dark:border-white/10">
                                <h5 className="text-xl font-medium leading-normal text-surface dark:text-white" id="exampleModalLabel">
                                    Hủy đơn
                                </h5>
                                <button
                                    type="button"
                                    className="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                                    data-twe-modal-dismiss
                                    aria-label="Close"
                                >
                                    <span className="[&>svg]:h-6 [&>svg]:w-6">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </span>
                                </button>
                            </div>

                            {/* Modal body */}
                            <div className="relative flex-auto p-4" data-twe-modal-body-ref>
                                <p>Lý do hủy đơn</p>
                                {reasons.map((reason, index) => (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`reason-${index}`}
                                            name="cancelReason"
                                            value={reason}
                                            onChange={this.handleReasonChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`reason-${index}`} className="cursor-pointer">
                                            {reason}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* Modal footer */}
                            <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 p-4 dark:border-white/10">
                                <button
                                    type="button"
                                    className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400"
                                    data-twe-modal-dismiss
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => this.handleAcceptCancelOrder()}
                                    type="button"
                                    className="ms-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light"
                                >
                                    Xác nhận hủy đơn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ListCheckOutUser);

