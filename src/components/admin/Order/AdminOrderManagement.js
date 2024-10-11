import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [orderStatusOptions, setOrderStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get('http://localhost:8080/admin/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setOrders(response.data);

        // Lấy thông tin chi tiết của tất cả đơn hàng ngay sau khi tải danh sách đơn hàng
        const orderIds = response.data.map(order => order.orderId);
        const orderDetailsPromises = orderIds.map(orderId =>
          axios.get(`http://localhost:8080/admin/api/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        );

        const orderDetailsResponses = await Promise.all(orderDetailsPromises);
        const newOrderDetails = orderDetailsResponses.reduce((acc, response) => {
          acc[response.data.orderId] = response.data;
          return acc;
        }, {});

        setOrderDetails(newOrderDetails); // Lưu thông tin chi tiết của tất cả đơn hàng
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders or order details:', error);
        setLoading(false);
      }
    };

    const fetchOrderStatusOptions = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:8080/admin/api/states', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setOrderStatusOptions(response.data);
      } catch (error) {
        console.error('Error fetching order status options:', error);
      }
    };

    fetchOrders();
    fetchOrderStatusOptions();
  }, []);


  // Open modal for confirming status change
  const handleStatusChange = (order, status) => {
    const validStatuses = getValidStatuses(order.orderStatus);

    // Kiểm tra nếu trạng thái được chọn không nằm trong các trạng thái hợp lệ
    if (!validStatuses.includes(status)) {
      alert(`Không thể chuyển từ trạng thái "${order.orderStatus}" sang trạng thái "${status}"`);
      return;
    }

    setOrderToUpdate(order);
    setStatusToUpdate(status);
    setShowModal(true);
  };


  // Confirm status update
  const confirmStatusUpdate = async () => {
    if (orderToUpdate && statusToUpdate) {
      const token = localStorage.getItem('jwtToken');

      // Lấy stateId từ orderStatusOptions dựa vào statusToUpdate
      const selectedState = orderStatusOptions.find(
        (status) => status.name_status_order === statusToUpdate
      );

      if (!selectedState) {
        alert("Trạng thái không hợp lệ");
        return;
      }

      const payload = {
        state: {
          id: selectedState.id,
        },
      };

      console.log("Sending payload:", payload); // Để kiểm tra dữ liệu trước khi gửi

      try {
        const response = await axios.put(
          `http://localhost:8080/admin/api/orders/${orderToUpdate.orderId}`,
          payload, // Gửi dữ liệu payload với stateId
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("API response:", response.data);

        toast.success('Cập nhật trạng thái thành công');

        // Cập nhật danh sách đơn hàng trong giao diện
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderToUpdate.orderId
              ? { ...order, orderStatus: statusToUpdate }
              : order
          )
        );
      } catch (error) {
        console.error("Error updating order status:", error.response ? error.response.data : error.message);
        toast.error('Cập nhật trạng thái thất bại');
      }

      setShowModal(false);
      setOrderToUpdate(null);
      setStatusToUpdate("");
    }
  };


  // Define valid status transitions based on current status
  const getValidStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "Đang chờ xử lý":
        return ["Đã Hủy", "Đã xác nhận"];
      case "Đã xác nhận":
        return ["Đã đóng gói", "Đang giao hàng"];
      case "Đã đóng gói":
        return ["Đang giao hàng"];
      case "Đang giao hàng":
        return ["Đã giao", "Đã trả lại"];
      case "Đã giao":
        return [];
      case "Đã trả lại":
        return ["Đã hoàn tiền"];
      default:
        return [];
    }
  };


  const toggleDetails = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      if (!orderDetails[orderId]) {
        const token = localStorage.getItem('jwtToken');
        try {
          const response = await axios.get(`http://localhost:8080/admin/api/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setOrderDetails(prevDetails => ({ ...prevDetails, [orderId]: response.data }));
        } catch (error) {
          console.error('Error fetching order details:', error);
        }
      }
      setExpandedOrderId(orderId);
    }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter orders by selected status tab
  const filteredOrders = activeTab === 'Tất cả'
    ? currentOrders
    : currentOrders.filter(order => order.orderStatus === activeTab);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý đơn hàng</h2>

      {/* Tab navigation for filtering orders by status */}
      {/* <div className="mb-4">
        <ul className="flex space-x-4">
          <li
            className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === 'Tất cả' ? 'bg-blue-500 text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('Tất cả')}
          >
            Tất cả
          </li>
          {orderStatusOptions.map((status) => (
            <li
              key={status.id}
              className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === status.name_status_order ? 'bg-blue-500 text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-slate-500'}`}
              onClick={() => setActiveTab(status.name_status_order)}
            >
              {status.name_status_order}
            </li>
          ))}
        </ul>
      </div> */}
      <div className="mb-4">
        <ul className="flex space-x-4">
          <li
            className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${activeTab === 'Tất cả' ? 'bg-blue-500 text-white font-bold shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('Tất cả')}
          >
            Tất cả
          </li>
          {orderStatusOptions.map((status) => (
            <li
              key={status.id}
              className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${activeTab === status.name_status_order ? 'bg-blue-500 text-white font-bold shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-slate-500'}`}
              onClick={() => setActiveTab(status.name_status_order)}
            >
              {status.name_status_order}
            </li>
          ))}
        </ul>
      </div>

      {/* Display orders based on selected tab */}
      <div className="overflow-x-auto">
        {filteredOrders.length > 0 ? (
          <table className="min-w-full bg-white border">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 border-b">Mã đơn hàng</th>
                <th className="px-4 py-3 border-b">Tên người đặt</th>
                <th className="px-4 py-3 border-b">Phí vận chuyển</th>
                <th className="px-4 py-3 border-b">Tổng tiền</th>
                <th className="px-4 py-3 border-b">Trạng thái</th>
                <th className="px-4 py-3 border-b">Thời gian đặt</th>
                <th className="px-4 py-3 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <React.Fragment key={order.orderId}>
                  <tr key={order.orderId} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                    {/* Mã đơn hàng */}
                    <td className="px-6 py-4 border-b">{order.orderId}</td>

                    <td className="px-6 py-4 border-b">
                      {orderDetails[order.orderId]?.userFullName || "N/A"}
                    </td>

                    {/* Phí vận chuyển */}
                    <td className="px-6 py-4 border-b">{order.deliveryFee?.toLocaleString() || 'N/A'} VNĐ</td>

                    {/* Tổng tiền */}
                    <td className="px-6 py-4 border-b">{order.totalCash?.toLocaleString() || 'N/A'} VNĐ</td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 border-b">
                      <div className="status-container">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          className="select-status"
                        >
                          <option value={order.orderStatus}>{order.orderStatus}</option>
                          {getValidStatuses(order.orderStatus).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>


                    {/* Thời gian đặt từ orderDetails */}
                    {/* <td className="px-6 py-4 border-b">
                      {orderDetails[order.orderId]?.createdDate
                        ? new Date(orderDetails[order.orderId].createdDate).toLocaleString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                        : "N/A"}
                    </td> */}
                    <td className="px-6 py-4 border-b">
                      {orderDetails[order.orderId]?.createdDate
                        ? (() => {
                          const orderDate = new Date(orderDetails[order.orderId].createdDate); // Thời gian đặt hàng
                          const now = new Date(); // Thời gian hiện tại
                          const timeDifference = Math.floor((now - orderDate) / 1000); // Chênh lệch thời gian tính theo giây

                          // Tính toán số ngày, giờ, phút, giây
                          const days = Math.floor(timeDifference / (3600 * 24));
                          const hours = Math.floor((timeDifference % (3600 * 24)) / 3600);
                          const minutes = Math.floor((timeDifference % 3600) / 60);
                          const seconds = timeDifference % 60;

                          // Hiển thị khoảng thời gian
                          if (days > 0) {
                            return `${days} ngày trước`;
                          } else if (hours > 0) {
                            return `${hours} giờ trước`;
                          } else if (minutes > 0) {
                            return `${minutes} phút trước`;
                          } else {
                            return `${seconds} giây trước`;
                          }
                        })()
                        : "N/A"}
                    </td>

                    {/* Hành động */}
                    <td className="px-6 py-4 border-b">
                      <button
                        onClick={() => toggleDetails(order.orderId)}
                        className="bg-blue-500 text-white px-3 py-2 text-xs font-medium rounded-lg shadow-sm hover:bg-blue-600 transition duration-300 ease-in-out"
                      >
                        {expandedOrderId === order.orderId ? 'Ẩn' : 'Chi tiết'}
                      </button>
                    </td>

                  </tr>
                  {expandedOrderId === order.orderId && orderDetails[order.orderId] && (
                    <tr className="bg-gray-50 transition-all ease-out duration-500">
                      <td colSpan="6" className="px-6 py-4">
                        <div className="flex justify-between space-x-4">
                          <div className="w-1/2">

                            <table className="min-w-full bg-white border">
                              <thead>
                                <tr>
                                  <th colSpan="2" className="px-4 py-3 bg-gray-200 text-left font-bold">Chi tiết đơn hàng #{order.orderId}</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-4 py-2 border">Tên người đặt:</td>
                                  <td className="px-4 py-2 border">{orderDetails[order.orderId].userFullName || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Email:</td>
                                  <td className="px-4 py-2 border">{orderDetails[order.orderId].userEmail || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Số điện thoại:</td>
                                  <td className="px-4 py-2 border">{orderDetails[order.orderId].userPhone || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Địa chỉ:</td>
                                  <td className="px-4 py-2 border">{orderDetails[order.orderId].shippingAddress || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Phí vận chuyển:</td>
                                  <td className="px-4 py-2 border">{orderDetails[order.orderId].deliveryFee?.toLocaleString() || 'N/A'} VNĐ</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Tổng tiền:</td>
                                  <td className="px-4 py-2 border">{orderDetails[order.orderId].totalCash?.toLocaleString() || 'N/A'} VNĐ</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Ngày & giờ đặt hàng:</td>
                                  <td className="px-4 py-2 border">
                                    {orderDetails[order.orderId]?.createdDate
                                      ? new Date(orderDetails[order.orderId].createdDate).toLocaleString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                      })
                                      : "N/A"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Phương thức thanh toán:</td>
                                  <td className="px-4 py-2 border">{orderDetails[order.orderId].paymentMethod || 'N/A'}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="w-1/2">

                            {orderDetails[order.orderId].productNames?.map((productName, index) => (
                              <div key={index}>
                                <table className="min-w-full bg-white border">
                                  <thead>
                                    <tr>
                                      <th colSpan="2" className="px-4 py-3 bg-gray-200 text-left font-bold">Sản phẩm đã mua</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {orderDetails[order.orderId].productNames?.map((productName, index) => (
                                      <React.Fragment key={index}>
                                        <tr>
                                          <td className="px-4 py-2 border">Tên sản phẩm:</td>
                                          <td className="px-4 py-2 border">{productName}</td>
                                        </tr>
                                        <tr>
                                          <td className="px-4 py-2 border">Màu sắc:</td>
                                          <td className="px-4 py-2 border">{orderDetails[order.orderId].variantNames[index] || 'Không có màu sắc'}</td>
                                        </tr>
                                        <tr>
                                          <td className="px-4 py-2 border">Kích thước:</td>
                                          <td className="px-4 py-2 border">{orderDetails[order.orderId].variantSizes[index] || 'Không có kích thước'}</td>
                                        </tr>
                                        <tr>
                                          <td className="px-4 py-2 border">Đơn giá:</td>
                                          <td className="px-4 py-2 border">{orderDetails[order.orderId].prices[index].toLocaleString()} VNĐ</td>
                                        </tr>
                                        <tr>
                                          <td className="px-4 py-2 border">Số lượng:</td>
                                          <td className="px-4 py-2 border">{orderDetails[order.orderId].quantities[index]}</td>
                                        </tr>
                                        <tr>
                                          <td colSpan="2" className="px-4 py-2 border"><hr /></td>
                                        </tr>
                                      </React.Fragment>
                                    ))}
                                  </tbody>
                                </table>
                                <hr></hr>
                              </div>
                            ))}
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">Không có đơn hàng nào</p>
        )}
      </div>

      {/* Pagination */}
      {/* <div className="mt-4">
        {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
          >
            {index + 1}
          </button>
        ))}
      </div> */}
      {/* Pagination */}
      <div className="pagination-container">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
        >
          &lt;
        </button>

        {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
          className={`pagination-button ${currentPage === Math.ceil(orders.length / ordersPerPage) ? 'disabled' : ''}`}
        >
          &gt;
        </button>
      </div>


      {/* Modal for confirming status change */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="Xác nhận cập nhật trạng thái"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h2 className="text-lg font-bold mb-4">Xác nhận cập nhật trạng thái</h2>
          <p>Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng #{orderToUpdate?.orderId} thành "{statusToUpdate}"?</p>
          <div className="mt-4">
            <button onClick={confirmStatusUpdate} className="bg-green-500 text-white px-4 py-2 rounded mr-4">
              Xác nhận
            </button>
            <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
              Hủy
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminOrderManagement;
