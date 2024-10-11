import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderStatusOptions, setOrderStatusOptions] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [activeTab, setActiveTab] = useState('Tất cả'); // State for managing active tab
  
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get('http://localhost:8080/admin/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
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

  const handleViewDetails = async (orderId) => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await axios.get(`http://localhost:8080/admin/api/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response && response.data) {
        setOrderDetails(response.data);
        setSelectedOrderId(orderId);
        setNewStatus(response.data.orderStatus);
        setIsModalOpen(true);
      } else {
        console.error('Order data is empty or undefined.');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleStatusChange = async (e) => {
    const token = localStorage.getItem('jwtToken');
    const updatedStatusId = e.target.value;

    try {
      await axios.put(
        `http://localhost:8080/admin/api/orders/${selectedOrderId}`,
        { state: { id: updatedStatusId } },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert('Cập nhật trạng thái thành công');
      setNewStatus(updatedStatusId);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Cập nhật trạng thái thất bại');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOrderDetails({});
  };

  // Filter orders by selected status tab
  const filteredOrders = activeTab === 'Tất cả' 
    ? orders 
    : orders.filter(order => order.orderStatus === activeTab);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lý đơn hàng</h2>

      {/* Tab navigation for filtering orders by status */}
      <div className="mb-4">
        <ul className="flex space-x-4">
          <li 
            className={`cursor-pointer ${activeTab === 'Tất cả' ? 'font-bold' : ''}`}
            onClick={() => setActiveTab('Tất cả')}
          >
            Tất cả
          </li>
          {orderStatusOptions.map((status) => (
            <li 
              key={status.id}
              className={`cursor-pointer ${activeTab === status.name_status_order ? 'font-bold' : ''}`}
              onClick={() => setActiveTab(status.name_status_order)}
            >
              {status.name_status_order}
            </li>
          ))}
        </ul>
      </div>

      {/* Display orders based on selected tab */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="text-left px-6 py-3">Mã đơn hàng</th>
              <th className="text-left px-6 py-3">Tên sản phẩm</th>
              <th className="text-left px-6 py-3">Phí vận chuyển</th>
              <th className="text-left px-6 py-3">Tổng tiền</th>
              <th className="text-left px-6 py-3">Trạng thái</th>
              <th className="text-left px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderId} className="border-t">
                <td className="px-6 py-4">{order.orderId}</td>
                <td className="px-6 py-4">{order.productNames.join(', ')}</td>
                <td className="px-6 py-4">{order.deliveryFee ? order.deliveryFee.toLocaleString() : 'N/A'} VNĐ</td>
                <td className="px-6 py-4">{order.totalCash ? order.totalCash.toLocaleString() : 'N/A'} VNĐ</td>
                <td className="px-6 py-4">{order.orderStatus || 'Chưa xác định'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewDetails(order.orderId)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for order details */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Chi tiết đơn hàng"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng #{selectedOrderId}</h2>
        {/* Order details here */}
        <button
          onClick={closeModal}
          className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
        >
          Đóng
        </button>
      </Modal>
    </div>
  );
};

export default AdminOrderManagement;
