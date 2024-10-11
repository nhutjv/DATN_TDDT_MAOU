import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faYoutube, faTiktok } from '@fortawesome/fontawesome-free';

class Footer extends React.Component {
    render() {
        return (
            <footer className="bg-gradient-to-r from-blue-200 to-pink-200 text-gray-800 py-12">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  
                        <div>
                            <h6 className="font-bold text-lg mb-4">MAOU</h6>
                            <p>Địa chỉ: 150/8 Nguyễn Duy Cung, Phường 12, Tp.Cần thơ</p>
                            <p>Số điện thoại: 19001393</p>
                            <p>Email: nnhut2705@egany.com</p>
                            <p className="mt-4 text-gray-600">© Bản quyền thuộc về MAOU | Cung cấp bởi MAOU</p>
                        </div>

                 
                        <div>
                            <h6 className="font-bold text-lg mb-4">CHÍNH SÁCH</h6>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-700 hover:underline">Giới thiệu</a></li>
                                <li><a href="#" className="text-gray-700 hover:underline">Hệ thống cửa hàng</a></li>
                                <li><a href="#" className="text-gray-700 hover:underline">Câu hỏi thường gặp</a></li>
                                <li><a href="#" className="text-gray-700 hover:underline">Gọi điện đặt hàng</a></li>
                            </ul>
                        </div>

                  
                        <div>
                            <h6 className="font-bold text-lg mb-4">HỖ TRỢ KHÁCH HÀNG</h6>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-700 hover:underline">Liên hệ</a></li>
                                <li><a href="#" className="text-gray-700 hover:underline">Chính sách bán hàng</a></li>
                                <li><a href="#" className="text-gray-700 hover:underline">Chính sách giao hàng</a></li>
                                <li><a href="#" className="text-gray-700 hover:underline">Chính sách đổi trả</a></li>
                            </ul>
                        </div>

                 
                        <div>
                            <h6 className="font-bold text-lg mb-4">ĐĂNG KÝ NHẬN TIN</h6>
                            <form className="flex">
                                <input
                                    type="email"
                                    className="p-2 rounded-l-md border border-gray-300 focus:outline-none w-full"
                                    placeholder="Nhập địa chỉ email"
                                />
                                <button className="p-2 bg-slate-400 text-white rounded-r-md hover:bg-blue-900 transition">
                                    Đăng ký
                                </button>
                            </form>
                            <div className="mt-6 flex space-x-4 text-2xl">
                                <a href="#" className="text-gray-700 hover:text-blue-50 transition">
                                    <FontAwesomeIcon icon={faFacebookF} />
                                </a>
                                <a href="#" className="text-gray-700 hover:text-pink-500 transition">
                                    <FontAwesomeIcon icon={faInstagram} />
                                </a>
                                <a href="#" className="text-gray-700 hover:text-red-600 transition">
                                    <FontAwesomeIcon icon={faYoutube} />
                                </a>
                                <a href="#" className="text-gray-700 hover:text-black transition">
                                    <FontAwesomeIcon icon={faTiktok} />
                                </a>
                            </div>
                        </div>
                    </div>

                
                    <div className="mt-12 flex justify-center items-center">
                        <img src="https://theme.hstatic.net/200000696635/1001257291/14/footer_trustbadge.png?v=100" alt="Payment Methods" className="h-8" />
                    </div>
                </div>
          
            </footer>
        );
    }
}

export default Footer;
