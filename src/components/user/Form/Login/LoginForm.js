import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from './AxiosConfig';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode'; // Sửa import cho jwtDecode

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: '',
        };
    }

    handleInputChange = (event) => {
        const { id, value } = event.target;
        this.setState({ [id]: value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const { username, password } = this.state;

        if (!username || !password) {
            toast.error('Không được để trống!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/v1/login', { username, password });
            const { jwt } = response.data;

            // Lưu token vào localStorage
            localStorage.setItem('jwtToken', jwt);

            // Giải mã token để lấy thông tin quyền
            const decoded = jwtDecode(jwt);

            // Kiểm tra xem người dùng có phải là ADMIN không
            const isAdmin = decoded.Role.some(role => role.authority === "ROLE_ADMIN");

            if (await isAdmin) {
                window.location.href = 'http://localhost:3000/admin/dashboard';
            } else {
                window.location.href = 'http://localhost:3000/home'
            }
            
        } catch (error) {
            toast.error('Tài khoản hoặc mật khẩu không chính xác');
        }
    };

    render() {
        const { username, password } = this.state;
        const isDisabled = !username || !password;
        return (
            <form onSubmit={(event) => this.handleSubmit(event)}>
                {/* <!--Sign in section--> */}
                <div
                    className="flex flex-row items-center justify-center lg:justify-start">
                    <p className="mb-0 me-4 text-lg">Đăng nhập bằng</p>

                    {/* <!-- Facebook --> */}
                    {/* <LoginWithFaceBook /> */}

                    {/* <!-- Facebook --> */}
                    {/* <LoginWithGoogle /> */}
                </div>

                {/* <!-- Separator between social media sign in and email/password sign in --> */}
                <div
                    className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
                    <p
                        className="mx-4 mb-0 text-center font-semibold dark:text-white">
                        Hoặc
                    </p>
                </div>

                {/* <!-- Email input --> */}
                <div className="relative mb-6" data-twe-input-wrapper-init>
                    <input
                        type="text"
                        className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                        id="username"
                        placeholder=""
                        value={this.state.username}
                        onChange={(event) => this.handleInputChange(event)}
                    />
                    <label
                        htmlFor="exampleFormControlInput2"
                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                    >Tên đăng nhập
                    </label>
                </div>

                {/* <!-- Password input --> */}
                <div className="relative mb-6" data-twe-input-wrapper-init>
                    <input
                        type="password"
                        className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                        id="password"
                        value={this.state.password}
                        onChange={(event) => this.handleInputChange(event)}
                        placeholder="Password" />
                    <label
                        htmlFor="exampleFormControlInput22"
                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                    >Mật khẩu
                    </label>
                </div>

                <div className="mb-6 flex items-center justify-between">
                    {/* <!-- Remember me checkbox --> */}
                    <div className="mb-[0.125rem] block min-h-[1.5rem] ps-[1.5rem]">
                        <input
                            className="relative  float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent rtl:float-right dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-primary"
                            type="checkbox"
                            value=""
                            id="exampleCheck2" />
                        <label
                            className="inline-block ps-[0.15rem] hover:cursor-pointer"
                            htmlFor="exampleCheck2">
                            Ghi nhớ tài khoản
                        </label>
                    </div>

                    {/* <!--Forgot password link--> */}
                    <Link to="/forgot">Quên mật khẩu?</Link>
                </div>

                {/* <!-- Login button --> */}
                <div className="text-center lg:text-left">
                    <button
                     disabled={isDisabled}
                        type="submit"
                        
                        className={`inline-block w-full rounded px-7 pb-2 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-300 ease-in-out 
                            ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:scale-110'}`}
                        data-twe-ripple-init
                        data-twe-ripple-color="light"
                    >
                        Đăng nhập
                    </button>

                    {/* <!-- Register link --> */}
                    <p className="mb-0 mt-2 pt-1 text-sm font-semibold">
                        Chưa có tài khoản?
                        <Link
                            to="/register"
                            className="text-danger transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700"
                        >Đăng ký</Link>
                    </p>
                </div>

            </form>
        );
    }
}

export default withRouter(LoginForm);
