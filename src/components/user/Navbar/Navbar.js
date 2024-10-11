import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from 'react-toastify';
import { withRouter } from "react-router-dom";
import { FaBell } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";
import SearchBar from "./SearchBar2";
import {
    Collapse,
    Dropdown,
    Ripple,
    Carousel,
    Input,
    initTWE
} from "tw-elements";
import axios from 'axios'; // Import axios để gọi API

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            categories: [], // State để lưu danh mục
        }
        this.handleLogout = this.handleLogout.bind(this);
    }

    // Lấy danh mục từ API khi component được mount
    async componentDidMount() {
        initTWE({ Collapse, Dropdown, Ripple, Carousel, Input });

        // Gọi API lấy danh mục
        try {
            const response = await axios.get('http://localhost:8080/user/api/products1/categories');
            this.setState({ categories: response.data });
        } catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
        }

        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                this.handleLogout();
            } else {
                this.setState({ user: decoded });
            }
        }
    }

    handleLogout = () => {
        this.setState({ user: null });
        localStorage.removeItem('jwtToken');
        sessionStorage.removeItem('name_prod');
        // this.props.history.push('');
        window.location.href = '/login'
    }

    handleOnClickCart() {
        window.location.href = 'http://localhost:3000/mycart'
    }

    render() {
        
        const { user, categories } = this.state; 
        return (
            <>
                <nav className="flex-no-wrap z-50 fixed w-full items-center justify-between lg:flex-wrap lg:justify-start bg-white shadow-sm mb-1" style={{ marginTop: 0, paddingTop: 0 }}>
                    <div className="flex-no-wrap  w-full items-center justify-between lg:flex-wrap lg:justify-start  bg-blue-200  shadow-sm mb-1" style={{ marginTop: 0, paddingTop: 0 }}>

                        <div className="w-full max-w-7xlmx-auto flex items-center justify-between px-4" style={{
                            background: 'linear-gradient(to right, rgba(173, 216, 230, 0.6), rgba(255, 192, 203, 0.6))'
                        }}>
                            <marquee className="text-pretty text-blue-950" style={{ fontFamily: 'Dancing Script, cursive' }}>
                                Miễn phí vận chuyển với đơn hàng trên 300K, Hãy nhanh tay đặt hàng ngay hôm nay để nhận ưu đãi!
                            </marquee>

                        </div>
                    </div>

                    <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4">
                        <button
                            className="text-2xl font-semibold"
                            onClick={() => window.location.href = "/"}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontFamily: 'Georgia, serif',
                                color: '#A3C1E0',
                                transition: 'color 0.3s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#abcfdb'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#A3C1E0'}
                        >
                            MAOU
                        </button>





                        {/* Main navigation items */}
                        <ul className="list-none flex space-x-8 items-center justify-center flex-1">
                            {/* <li className="relative group">
                                <NavLink to="/" className="text-black/60 hover:text-black/80 transition duration-200">
                                    TRANG CHỦ
                                </NavLink>
                                <span className="block h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                            </li> */}
                            <li className="relative group">
                                <NavLink to="/header" className=" font-bold text-black/60 hover:text-black/80 transition duration-200">
                                    DANH MỤC
                                </NavLink>

                                {/* Dropdown hiển thị danh mục */}
                                <div
                                    className="absolute top-full left-0 mt-0 w-[390px] h-auto bg-white shadow-lg rounded-lg opacity-0 transform scale-95 transition-all duration-500 ease-out overflow-y-auto group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-0"
                                >
                                    <div className="grid grid-cols-3 gap-x-4 p-4">
                                        {categories.length > 0 ? (
                                            categories.map((category) => (
                                                <ul key={category.id} className="divide-y divide-gray-200 text-sm">
                                                    <li className="p-2 hover:bg-gray-100 cursor-pointer">{category.name_cate}</li>
                                                </ul>
                                            ))
                                        ) : (
                                            <p>Đang tải danh mục...</p>
                                        )}
                                    </div>
                                </div>
                            </li>








                            <li className="relative group">
                                <NavLink to="/san-pham" className="font-bold text-black/60 hover:text-black/80 transition duration-200">
                                    SALE
                                </NavLink>
                                <span className="block h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                            </li>
                            <li className="relative group">
                                <NavLink to="/product-views" className="font-bold text-black/60 hover:text-black/80 transition duration-200">
                                    LIÊN HỆ
                                </NavLink>
                                <span className="block h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                            </li>
                            <li className="relative group">
                                <NavLink to="/blog" className="font-bold text-black/60 hover:text-black/80 transition duration-200">
                                    TIN TỨC
                                </NavLink>
                                <span className="block h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                            </li>
                        </ul>





                        <div className="flex items-center">

                            {/* tk-*/}

                            {/* THÔNG BÁO */}
                            <div className="relative flex items-center ms-3">

                            <SearchBar />

                                <div
                                    className="relative"
                                    data-twe-dropdown-ref
                                    data-twe-dropdown-alignment="end">
                                    <button
                                        className="me-4 flex items-center text-neutral-600 dark:text-white"
                                        id="dropdownMenuButton1"
                                        data-twe-dropdown-toggle-ref
                                        aria-expanded="false"
                                        style={{ background: "none", border: "none", cursor: "pointer" }}
                                    >
                                        <FaBell className="w-5 h-5" /> {/* Adjust width and height here */}
                                        <span className="absolute -mt-2.5 ml-2 rounded-full bg-danger px-1.5 py-0.5 text-xs text-white">1</span>
                                    </button>


                                    <ul
                                        className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark"
                                        aria-labelledby="dropdownMenuButton1"
                                        data-twe-dropdown-menu-ref>
                                        <li>
                                            <button
                                                className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                                                onClick={() => window.location.href = "#"}
                                                style={{ background: "none", border: "none", cursor: "pointer" }}
                                            >Action</button>
                                        </li>
                                        <li>
                                            <button
                                                className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                                                onClick={() => window.location.href = "#"}
                                                style={{ background: "none", border: "none", cursor: "pointer" }}
                                            >Another action</button>
                                        </li>
                                        <li>
                                            <button
                                                className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                                                onClick={() => window.location.href = "#"}
                                                style={{ background: "none", border: "none", cursor: "pointer" }}
                                            >Something else here</button>
                                        </li>
                                    </ul>
                                </div>
                                <button onClick={() => this.handleOnClickCart()} className="me-4 flex items-center  text-neutral-600 dark:text-white">
                                    <span className="[&>svg]:w-5">
                                        <img
                                            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1Ljk5OTYgOEMxNS45OTk2IDkuMDYwODcgMTUuNTc4MiAxMC4wNzgzIDE0LjgyOCAxMC44Mjg0QzE0LjA3NzkgMTEuNTc4NiAxMy4wNjA1IDEyIDExLjk5OTYgMTJDMTAuOTM4NyAxMiA5LjkyMTMxIDExLjU3ODYgOS4xNzExNiAxMC44Mjg0QzguNDIxMDIgMTAuMDc4MyA3Ljk5OTU5IDkuMDYwODcgNy45OTk1OSA4TTMuNjMyODEgNy40MDEzOEwyLjkzMjgxIDE1LjgwMTRDMi43ODI0MyAxNy42MDU5IDIuNzA3MjQgMTguNTA4MiAzLjAxMjI3IDE5LjIwNDJDMy4yODAyNyAxOS44MTU3IDMuNzQ0NjIgMjAuMzIwNCA0LjMzMTc3IDIwLjYzODJDNS4wMDAwNiAyMSA1LjkwNTQ1IDIxIDcuNzE2MjMgMjFIMTYuMjgzQzE4LjA5MzcgMjEgMTguOTk5MSAyMSAxOS42Njc0IDIwLjYzODJDMjAuMjU0NiAyMC4zMjA0IDIwLjcxODkgMTkuODE1NyAyMC45ODY5IDE5LjIwNDJDMjEuMjkxOSAxOC41MDgyIDIxLjIxNjcgMTcuNjA1OSAyMS4wNjY0IDE1LjgwMTRMMjAuMzY2NCA3LjQwMTM4QzIwLjIzNyA1Ljg0ODc1IDIwLjE3MjMgNS4wNzI0MyAxOS44Mjg1IDQuNDg0ODZDMTkuNTI1NyAzLjk2NzQ0IDE5LjA3NDggMy41NTI2IDE4LjUzNDEgMy4yOTM4NUMxNy45MiAzIDE3LjE0MSAzIDE1LjU4MyAzTDguNDE2MjMgM0M2Ljg1ODIxIDMgNi4wNzkyMSAzIDUuNDY1MSAzLjI5Mzg0QzQuOTI0MzMgMy41NTI2IDQuNDczNDkgMy45Njc0NCA0LjE3MDcxIDQuNDg0ODZDMy44MjY4OSA1LjA3MjQzIDMuNzYyMTkgNS44NDg3NSAzLjYzMjgxIDcuNDAxMzhaIiBzdHJva2U9IiMzMzNGNDgiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg=="
                                            alt="Giỏ hàng"
                                            style={{ height: '24px', width: '24px' }}
                                        />
                                    </span>
                                </button>



                                {/* TÀI KHOẢN- */}
                                <div
                                    className="relative"
                                    data-twe-dropdown-ref
                                    data-twe-dropdown-alignment="end">
                                    <button
                                        className="flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
                                        id="dropdownMenuButton2"
                                        data-twe-dropdown-toggle-ref
                                        aria-expanded="false"
                                        style={{ background: "none", border: "none", cursor: "pointer" }}
                                    >
                                        <img
                                            src={user != null ? user.image : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNSAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuODE2MyAxOS40Mzg0QzYuNDI0NjIgMTguMDA1MiA3Ljg0NDkyIDE3IDkuNSAxN0gxNS41QzE3LjE1NTEgMTcgMTguNTc1NCAxOC4wMDUyIDE5LjE4MzcgMTkuNDM4NE0xNi41IDkuNUMxNi41IDExLjcwOTEgMTQuNzA5MSAxMy41IDEyLjUgMTMuNUMxMC4yOTA5IDEzLjUgOC41IDExLjcwOTEgOC41IDkuNUM4LjUgNy4yOTA4NiAxMC4yOTA5IDUuNSAxMi41IDUuNUMxNC43MDkxIDUuNSAxNi41IDcuMjkwODYgMTYuNSA5LjVaTTIyLjUgMTJDMjIuNSAxNy41MjI4IDE4LjAyMjggMjIgMTIuNSAyMkM2Ljk3NzE1IDIyIDIuNSAxNy41MjI4IDIuNSAxMkMyLjUgNi40NzcxNSA2Ljk3NzE1IDIgMTIuNSAyQzE4LjAyMjggMiAyMi41IDYuNDc3MTUgMjIuNSAxMloiIHN0cm9rZT0iIzMzM0Y0OCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K'}
                                            className="rounded-full"
                                            style={{ height: "30px", width: "27px" }}
                                            alt=""
                                            loading="lazy" />
                                        {/* <label style={{ marginLeft: "20px", background: "none", border: "none", cursor: "pointer" }}> {user != null ? user.username : ''}</label> */}
                                    </button>
                                    <ul
                                        className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark"
                                        aria-labelledby="dropdownMenuButton2"
                                        data-twe-dropdown-menu-ref>
                                        {
                                            user ?
                                                <>
                                                    <li>
                                                        <NavLink to="/myprofile"
                                                            className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                                                            onClick={() => window.location.href = "#"}
                                                            style={{ background: "none", border: "none", cursor: "pointer" }}
                                                        >Tài khoản</NavLink>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                                                            onClick={() => this.handleLogout()}
                                                            style={{ background: "none", border: "none", cursor: "pointer" }}
                                                        >Đăng xuất</button>
                                                    </li>
                                                </>
                                                :
                                                <>
                                                    <li>
                                                        <NavLink to="/login"
                                                            className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                                                            onClick={() => window.location.href = "#"}
                                                            style={{ background: "none", border: "none", cursor: "pointer" }}
                                                        >Đăng nhập</NavLink>
                                                    </li>

                                                    <li>
                                                        <NavLink to="/register"
                                                            className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                                                            onClick={() => window.location.href = "#"}
                                                            style={{ background: "none", border: "none", cursor: "pointer" }}
                                                        >Đăng ký</NavLink>
                                                    </li>
                                                </>
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav >
            </>
        );
    }
}

export default withRouter(Navbar);
