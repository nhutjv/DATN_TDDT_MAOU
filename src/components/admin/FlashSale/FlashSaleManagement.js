import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

const FlashSaleManagement = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [newFlashSale, setNewFlashSale] = useState({
    id: null,
    name_FS: '',
    status: 1, //
    activitySales: [{ id: null, discountPercent: '', createdDate: '', expirationDate: '' }],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Flash Sales
  useEffect(() => {
    fetchFlashSales();
  }, [currentPage]);

  const fetchFlashSales = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      toast.error('Token không tồn tại! Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:8080/admin/api/flashsales', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFlashSales(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          toast.error('Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại.');
        } else {
          toast.error('Lỗi khi tải danh sách Flash Sale!');
        }
      });
  };

  // Create Flash Sale
  const createFlashSale = async (flashSaleData, token) => {
    try {
      await axios.post('http://localhost:8080/admin/api/flashsales', flashSaleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Tạo chương trình giảm giá thành công!');
      fetchFlashSales();
      resetForm();
    } catch (error) {
      toast.error('Lỗi khi tạo chương trình giảm giá!');
    }
  };

  // Update Flash Sale
  const updateFlashSale = async (flashSaleData, token) => {
    try {
      await axios.put(`http://localhost:8080/admin/api/flashsales/${newFlashSale.id}`, flashSaleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Chỉnh sửa thành công!');
      fetchFlashSales();
      resetForm();
    } catch (error) {
      toast.error('Lỗi khi chỉnh sửa chương trình giảm giá!');
    }
  };


  const saveFlashSale = async () => {
    if (!newFlashSale.name_FS) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }
  
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwtDecode(token);
    const id_user = decodedToken.id_user;
  
    const formatDateToISO = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString();
    };
  
    const flashSaleData = {
      name_FS: newFlashSale.name_FS,
      status: newFlashSale.status, // Đảm bảo status là boolean
      id_user,
      activitySales: newFlashSale.activitySales.map((activitySale) => ({
        id: activitySale.id,
        discountPercent: Number(activitySale.discountPercent),
        createdDate: formatDateToISO(activitySale.createdDate),
        expirationDate: formatDateToISO(activitySale.expirationDate),
      })),
    };
  
    // Log dữ liệu trước khi gửi yêu cầu
    console.log('Dữ liệu Flash Sale:', flashSaleData);
  
    if (isEditing) {
      await updateFlashSale(flashSaleData, token);
    } else {
      await createFlashSale(flashSaleData, token);
    }
  };
  


const editFlashSale = (flashSale) => {
  setNewFlashSale({
    id: flashSale.id,
    name_FS: flashSale.name_FS,
    status: flashSale.status, 
    activitySales: flashSale.activitySales.map((activitySale) => ({
      id: activitySale.id,
      discountPercent: activitySale.discountPercent,
      createdDate: activitySale.createdDate.split('T')[0],
      expirationDate: activitySale.expirationDate.split('T')[0],
    })),
  });
  setIsEditing(true); 
};



  // Reset Form
  const resetForm = () => {
    setNewFlashSale({
      id: null,
      name_FS: '',
      status: 1,
      activitySales: [{ id: null, discountPercent: '', createdDate: '', expirationDate: '' }],
    });
    setIsEditing(false);
  };

  // Handle Input Change
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedActivitySales = [...newFlashSale.activitySales];
    updatedActivitySales[index] = { ...updatedActivitySales[index], [name]: value };
    setNewFlashSale({ ...newFlashSale, activitySales: updatedActivitySales });
  };

  const totalPages = Math.ceil(flashSales.length / itemsPerPage);
  const currentFlashSales = flashSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">Quản lý Chương trình Giảm giá (Flash Sale)</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {isEditing ? 'Chỉnh sửa Chương trình Giảm giá' : 'Tạo mới Chương trình Giảm giá'}
        </h3>
        <input
          type="text"
          name="name_FS"
          placeholder="Tên chương trình"
          className="border px-4 py-2 mb-2"
          value={newFlashSale.name_FS}
          onChange={(e) => setNewFlashSale({ ...newFlashSale, name_FS: e.target.value })}
        />

<select
  name="status"
  className="border px-4 py-2 mb-2"
  value={newFlashSale.status ? "1" : "0"} 
  onChange={(e) => setNewFlashSale({ ...newFlashSale, status: e.target.value === "1" })} 
>
  <option value="1">Hoạt động</option>
  <option value="0">Không hoạt động</option>
</select>


        {newFlashSale.activitySales.map((activitySale, index) => (
          <div key={index}>
            <input
              type="number"
              name="discountPercent"
              placeholder="Phần trăm giảm giá"
              className="border px-4 py-2 mb-2"
              value={activitySale.discountPercent}
              onChange={(e) => handleChange(e, index)}
            />
            <input
              type="date"
              name="createdDate"
              placeholder="Ngày bắt đầu"
              className="border px-4 py-2 mb-2"
              value={activitySale.createdDate}
              onChange={(e) => handleChange(e, index)}
            />
            <input
              type="date"
              name="expirationDate"
              placeholder="Ngày kết thúc"
              className="border px-4 py-2 mb-2"
              value={activitySale.expirationDate}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
        ))}

        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={saveFlashSale}>
          {isEditing ? 'Lưu chỉnh sửa' : 'Tạo Chương trình'}
        </button>
        {isEditing && (
          <button className="bg-gray-500 text-white px-4 py-2 rounded ml-4" onClick={resetForm}>
            Hủy chỉnh sửa
          </button>
        )}
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-3 border-b">Tên chương trình</th>
                <th className="px-4 py-3 border-b">Trạng thái</th>
                <th className="px-4 py-3 border-b">Ngày tạo</th>
                <th className="px-4 py-3 border-b">Hoạt động giảm giá</th>
                <th className="px-4 py-3 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentFlashSales.map((flashSale) => (
                <tr key={flashSale.id}>
                  <td className="px-4 py-2 border-b">{flashSale.name_FS}</td>
                  <td className="px-4 py-2 border-b">
                    {flashSale.status === true ? 'Hoạt động' : 'Không hoạt động'}</td>

                  <td className="px-4 py-2 border-b">
                    {new Date(flashSale.created_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {flashSale.activitySales.map((activitySale) => (
                      <div key={activitySale.id}>
                        <p>Giảm giá: {activitySale.discountPercent}%</p>
                        <p>Ngày bắt đầu: {new Date(activitySale.createdDate).toLocaleDateString()}</p>
                        <p>Ngày kết thúc: {new Date(activitySale.expirationDate).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => editFlashSale(flashSale)}>
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 ${currentPage === 1 ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
            >
              Trang trước
            </button>
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num + 1}
                onClick={() => setCurrentPage(num + 1)}
                className={`px-4 py-2 ${currentPage === num + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {num + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`px-4 py-2 ${currentPage === totalPages ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
            >
              Trang sau
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FlashSaleManagement;
