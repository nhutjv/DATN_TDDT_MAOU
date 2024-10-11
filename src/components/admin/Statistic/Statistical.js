import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salesStatistics, setSalesStatistics] = useState([]); // Thống kê sản phẩm bán được
    const [revenueStatistics, setRevenueStatistics] = useState(null); // Thống kê doanh thu
    const [inventoryStatistics, setInventoryStatistics] = useState([]); // Thống kê tồn kho

    const [currentPageSales, setCurrentPageSales] = useState(1);
    const [currentPageInventory, setCurrentPageInventory] = useState(1);
    const productsPerPage = 10;


    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; 
        setEndDate(today);
    }, []);

    const handleFetchStatistics = () => {
        const token = localStorage.getItem('jwtToken');

        // Lấy thống kê sản phẩm bán được
        axios.get('http://localhost:8080/admin/api/statistics/sales-products', {
            params: { fromDate: startDate, toDate: endDate },
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            setSalesStatistics(response.data);
        }).catch(error => {
            console.error('Error fetching sales statistics:', error);
        });

        // Lấy thống kê doanh thu
        axios.get('http://localhost:8080/admin/api/statistics/revenue', {
            params: { fromDate: startDate, toDate: endDate },
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            setRevenueStatistics(response.data);
        }).catch(error => {
            console.error('Error fetching revenue statistics:', error);
        });

        // Lấy thống kê tồn kho
        axios.get('http://localhost:8080/admin/api/statistics/inventory', {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            setInventoryStatistics(response.data);
        }).catch(error => {
            console.error('Error fetching inventory statistics:', error);
        });
    };


    const indexOfLastProductSales = currentPageSales * productsPerPage;
    const indexOfFirstProductSales = indexOfLastProductSales - productsPerPage;
    const currentSalesProducts = salesStatistics.slice(indexOfFirstProductSales, indexOfLastProductSales);


    const indexOfLastProductInventory = currentPageInventory * productsPerPage;
    const indexOfFirstProductInventory = indexOfLastProductInventory - productsPerPage;
    const currentInventoryProducts = inventoryStatistics.slice(indexOfFirstProductInventory, indexOfLastProductInventory);

    const paginateSales = (pageNumber) => setCurrentPageSales(pageNumber);
    const paginateInventory = (pageNumber) => setCurrentPageInventory(pageNumber);

    return (
        <div className="container p-6">
            <h2 className="text-2xl font-bold mb-4">Thống kê</h2>

            {/* Chọn ngày bắt đầu và kết thúc */}
            <div className="flex space-x-4 mb-6">
                <div>
                    <label className="block mb-2">Từ ngày:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="border px-4 py-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block mb-2">Đến ngày:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="border px-4 py-2 rounded w-full"
                    />

                </div>
                <div>
                    <label className="block mb-2">Thống kê</label>
                    <button
                        onClick={handleFetchStatistics}
                        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                    >
                        Lấy dữ liệu thống kê
                    </button>
                </div>
            </div>



            {/* Hiển thị kết quả thống kê */}
            <div className="grid grid-cols-1 gap-6">
                {/* Sản phẩm bán được */}
                <div className="bg-white shadow p-4 rounded">
                    <h3 className="font-bold mb-2">Sản phẩm bán được</h3>
                    {salesStatistics.length > 0 ? (
                        <>
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4">STT</th>
                                        <th className="py-2 px-4">Tên sản phẩm</th>
                                        <th className="py-2 px-4">Phiên bản</th>
                                        <th className="py-2 px-4">Giá</th>
                                        <th className="py-2 px-4">Số lượng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentSalesProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td className="border py-2 px-4">{(currentPageSales - 1) * productsPerPage + index + 1}</td> {/* Hiển thị số thứ tự */}
                                            <td className="border py-2 px-4">{product.nameProd}</td>
                                            <td className="border py-2 px-4">{product.variantName}</td>
                                            <td className="border py-2 px-4">{product.price}</td>
                                            <td className="border py-2 px-4">{product.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>


                            <div className="pagination-container mt-4">
                                <button
                                    onClick={() => paginateSales(currentPageSales - 1)}
                                    disabled={currentPageSales === 1}
                                    className={`pagination-button ${currentPageSales === 1 ? 'disabled' : ''}`}
                                >
                                    &lt;
                                </button>

                                {Array.from({ length: Math.ceil(salesStatistics.length / productsPerPage) }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => paginateSales(i + 1)}
                                        className={`pagination-button ${currentPageSales === i + 1 ? 'active' : ''}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => paginateSales(currentPageSales + 1)}
                                    disabled={currentPageSales === Math.ceil(salesStatistics.length / productsPerPage)}
                                    className={`pagination-button ${currentPageSales === Math.ceil(salesStatistics.length / productsPerPage) ? 'disabled' : ''}`}
                                >
                                    &gt;
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>Chưa có dữ liệu.</p>
                    )}
                </div>

                {/*  doanh thu */}
                <div className="bg-white shadow p-4 rounded">
                    <h3 className="font-bold mb-2">Doanh thu</h3>
                    {revenueStatistics !== null ? (
                        <p>Tổng doanh thu: {revenueStatistics.toLocaleString()} VND</p>
                    ) : (
                        <p>Chưa có dữ liệu.</p>
                    )}
                </div>

                {/*  tồn kho */}
                <div className="bg-white shadow p-4 rounded">
                    <h3 className="font-bold mb-2">Tồn kho</h3>
                    {inventoryStatistics.length > 0 ? (
                        <>
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4">STT</th>
                                        <th className="py-2 px-4">Tên sản phẩm</th>
                                        <th className="py-2 px-4">Số lượng tồn kho</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentInventoryProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td className="border py-2 px-4">{(currentPageInventory - 1) * productsPerPage + index + 1}</td> {/* Hiển thị số thứ tự */}
                                            <td className="border py-2 px-4">{product.productName}</td>
                                            <td className="border py-2 px-4">{product.quantityAvailable}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>


                            <div className="pagination-container mt-4">
                                <button
                                    onClick={() => paginateInventory(currentPageInventory - 1)}
                                    disabled={currentPageInventory === 1}
                                    className={`pagination-button ${currentPageInventory === 1 ? 'disabled' : ''}`}
                                >
                                    &lt;
                                </button>

                                {Array.from({ length: Math.ceil(inventoryStatistics.length / productsPerPage) }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => paginateInventory(i + 1)}
                                        className={`pagination-button ${currentPageInventory === i + 1 ? 'active' : ''}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => paginateInventory(currentPageInventory + 1)}
                                    disabled={currentPageInventory === Math.ceil(inventoryStatistics.length / productsPerPage)}
                                    className={`pagination-button ${currentPageInventory === Math.ceil(inventoryStatistics.length / productsPerPage) ? 'disabled' : ''}`}
                                >
                                    &gt;
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>Chưa có dữ liệu.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Statistics;
