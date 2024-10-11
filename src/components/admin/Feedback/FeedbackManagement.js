import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStar, setFilterStar] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterUserName, setFilterUserName] = useState('');
    const [filterProductName, setFilterProductName] = useState('');
    const [expandedIds, setExpandedIds] = useState([]);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchFeedbacks();
    }, [currentPage]);

    const fetchFeedbacks = () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            toast.error('Token không tồn tại! Vui lòng đăng nhập lại.');
            setLoading(false);
            return;
        }

        axios.get('http://localhost:8080/admin/api/feedbacks', {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(response => {
            setFeedbacks(response.data);
            setLoading(false);
        })
        .catch(error => {
            setLoading(false);
            if (error.response && error.response.status === 401) {
                toast.error('Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại.');
            } else {
                toast.error('Lỗi khi tải danh sách đánh giá!');
            }
        });
    };

    const toggleExpand = (id) => {
        setExpandedIds(expandedIds.includes(id) ? expandedIds.filter(expId => expId !== id) : [...expandedIds, id]);
    };

    const renderContent = (feedback) => {
        const isExpanded = expandedIds.includes(feedback.id);
        const contentToShow = isExpanded ? feedback.content : feedback.content.substring(0, 10) + (feedback.content.length > 10 ? '...' : '');
        return (
            <>
                <p>{contentToShow}</p>
                {feedback.content.length > 10 && (
                    <button className="text-blue-500" onClick={() => toggleExpand(feedback.id)}>
                        {isExpanded ? 'Thu gọn' : 'Hiện thêm'}
                    </button>
                )}
            </>
        );
    };

    const filteredFeedbacks = feedbacks.filter(feedback => {
        const matchesStar = filterStar ? feedback.numberStar === parseInt(filterStar) : true;
        const matchesDate = filterDate ? new Date(feedback.createdDate).toLocaleDateString() === filterDate : true;
        const matchesUserName = filterUserName ? feedback.userName.toLowerCase().includes(filterUserName.toLowerCase()) : true;
        const matchesProductName = filterProductName ? feedback.productName.toLowerCase().includes(filterProductName.toLowerCase()) : true;
        return matchesStar && matchesDate && matchesUserName && matchesProductName;
    });

    const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
    const currentFeedbacks = filteredFeedbacks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-6 text-center">Quản lý đánh giá sản phẩm</h2>

            <div className="flex space-x-4 mb-4">
                <input
                    type="number"
                    placeholder="Lọc theo số sao"
                    className="border px-4 py-2"
                    value={filterStar}
                    onChange={e => setFilterStar(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Lọc theo ngày bình luận"
                    className="border px-4 py-2"
                    value={filterDate}
                    onChange={e => setFilterDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Lọc theo tên người dùng"
                    className="border px-4 py-2"
                    value={filterUserName}
                    onChange={e => setFilterUserName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Lọc theo tên sản phẩm"
                    className="border px-4 py-2"
                    value={filterProductName}
                    onChange={e => setFilterProductName(e.target.value)}
                />
            </div>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <>
                    <table className="min-w-full bg-white shadow-md rounded-lg border">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="px-6 py-3 border-b">Ngày tạo</th>
                                <th className="px-6 py-3 border-b">Số sao</th>
                                <th className="px-6 py-3 border-b">Sản phẩm</th>
                                <th className="px-6 py-3 border-b">Người dùng</th>
                                <th className="px-6 py-3 border-b">Nội dung</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentFeedbacks.map(feedback => (
                                <tr key={feedback.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 border-b">{new Date(feedback.createdDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 border-b">
                                        {[...Array(5)].map((_, index) => (
                                            <FontAwesomeIcon
                                                key={index}
                                                icon={faStar}
                                                className={index < feedback.numberStar ? "text-yellow-400" : "text-gray-300"}
                                            />
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 border-b">{feedback.productName}</td>
                                    <td className="px-6 py-4 border-b">{feedback.userName}</td>
                                    <td className="px-6 py-4 border-b">
                                        {renderContent(feedback)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className={`px-4 py-2 mr-2 ${currentPage === 1 ? 'bg-gray-200' : 'bg-blue-500 text-white'} rounded`}
                        >
                            Trang trước
                        </button>
                        {[...Array(totalPages).keys()].map(num => (
                            <button
                                key={num + 1}
                                onClick={() => setCurrentPage(num + 1)}
                                className={`px-4 py-2 mx-1 ${currentPage === num + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                            >
                                {num + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className={`px-4 py-2 ml-2 ${currentPage === totalPages ? 'bg-gray-200' : 'bg-blue-500 text-white'} rounded`}
                        >
                            Trang sau
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default FeedbackManagement;
