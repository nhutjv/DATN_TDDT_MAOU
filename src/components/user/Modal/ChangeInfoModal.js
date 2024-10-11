import React, { Component } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export default class ChangeInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        id_user: "",
        username: "",
        password: "",
        fullName: "",
        email: "",
        birthday: "",
        phone: "",
        gender: "",
        status_user: true,
      },
    };
  }
  componentDidMount() {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const id_user = decodedToken.id_user;
      axios
        .get(`http://localhost:8080/user/api/info/${id_user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.setState({
            user: response.data,
          });
          console.log(this.state.user);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          toast.error("Không thể tải thông tin người dùng.");
        });
    } else {
      toast.error("Bạn cần đăng nhập.");
      this.props.history.push("/login");
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.setState({ user: this.props.user });
    }
  }
  handleInputChange = (e) => {
    const { name, value } = e.target;
  
    this.setState((prevState) => ({
      user: {
        ...prevState.user,
        [name]: name === "gender" ? value === "true" : value, // Chuyển đổi giá trị của gender thành boolean
      },
    }));
  };
  

  handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("Bạn cần đăng nhập thay đổi thông tin");
      this.props.history.push("/login");
      return;
    } else {
      const decoded = jwtDecode(token);
      try {
        // const id_user = this.state.user.id_user;
        const response = await axios.put(
          `http://localhost:8080/user/api/info/update/${decoded.id_user}`,
          this.state.user,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status >= 200 && response.status < 300) {
          toast.success("User information updated successfully!");
        } else {
          console.log("Update failed:", response);
          toast.error("Failed to update user information.");
        }
      } catch (error) {
        console.error("Error updating user info:", error);
        toast.error(
          error.response
            ? error.response.data.message
            : "Lỗi nhập liệu mời bạn kiểm tra."
        );
      }
    }
  };

  render() {
    const { user } = this.state;
    return (
      <>
        {/* <form > */}
          {/* <!-- Email input --> */}
          <div class="relative mb-6" data-twe-input-wrapper-init>
            <input
              type="text"
              className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
              id="exampleFormControlInput2"
              name="username"
              value={this.state.user.username}
              onChange={this.handleInputChange}
              disabled
            />
            <label
              for="exampleFormControlInput2"
              className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
            >
              Tên đăng nhập
            </label>
          </div>

          <div class=" flex items-center justify-between">
            <div class="relative mb-6 w-6/12 me-10" data-twe-input-wrapper-init>
              <input
                type="text"
                className=" peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                id="exampleFormControlInput22"
                name="fullName"
                value={this.state.user.fullName}
                onChange={this.handleInputChange}
              />
              <label
                for="exampleFormControlInput22"
                className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
              >
                Họ tên đầy đủ
              </label>
            </div>
            <div class="relative mb-6 w-6/12" data-twe-input-wrapper-init>
              <input
                type="email"
                className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                id="exampleFormControlInput22"
                placeholder="Email"
                name="email"
                value={user.email}
                onChange={this.handleInputChange}
              />
              <label
                for="exampleFormControlInput22"
                className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
              >
                Email
              </label>
            </div>
          </div>

          {/*Ngày sinh và số điện thoại  */}
          <div class=" flex items-center justify-between">
            <div class="relative mb-6 w-6/12 me-10" data-twe-input-wrapper-init>
              <input
                style={{ opacity: 1 }}
                type="date"
                className=" peer block min-h-[auto] w-full rounded  bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary "
                id="exampleFormControlInput22"
                placeholder=""
                name="birthday"
                value={user.birthday}
                onChange={this.handleInputChange}
              />
              <label
                for="exampleFormControlInput22"
                className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
              >
                Ngày sinh
              </label>
            </div>
            <div class="relative mb-6 w-6/12" data-twe-input-wrapper-init>
              <input
                type="text"
                className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                id="exampleFormControlInput22"
                placeholder="Password"
                name="phone"
                value={user.phone}
                onChange={this.handleInputChange}
              />
              <label
                for="exampleFormControlInput22"
                className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
              >
                Số điện thoại
              </label>
            </div>
          </div>

          {/* Radio checkbox */}
          <div class="mb-6 flex items-center justify-between w-6/12">
            {/* <!--First radio--> */}
            <label>Giới tính</label>
            <div className="mb-[0.125rem] me-4 inline-block min-h-[1.5rem] ps-[1.5rem]">
              <input
                type="radio"
                name="gender"
                value={true} // For Male
                {...this.state.user.gender === true ? 'checked'  : ''}
                onChange={this.handleInputChange}
                checked={this.state.user.gender === true}
                // check
                // onSelect={this.state.user.gender === true}
              />
              <label
                class="mt-px inline-block ps-[0.15rem] hover:cursor-pointer"
                for="inlineRadio1"
              >
                Nam
              </label>
            </div>

            {/* <!--Second radio--> */}
            <div class="mb-[0.125rem] me-4 inline-block min-h-[1.5rem] ps-[1.5rem]">
              <input
                type="radio"
                name="gender"
                value={false} // For Female
                {...this.state.user.gender === false ? 'checked'  : ''}
                onChange={this.handleInputChange}
               checked={this.state.user.gender === false}
              />
              <label
                class="mt-px inline-block ps-[0.15rem] hover:cursor-pointer"
                for="inlineRadio2"
              >
                Nữ
              </label>
            </div>
          </div>
          <div class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 p-4 dark:border-white/10">
            <button
              type="button"
              className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400"
              data-twe-modal-dismiss
              data-twe-ripple-init
              data-twe-ripple-color="light"
              onClick={this.props.onClose}
            >
              Close
            </button>
            <button
            onClick={this.handleSubmit}
              type="submit"
              className="ms-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              data-twe-ripple-init
              data-twe-ripple-color="light"
            >
              Save changes
            </button>
          </div>
        {/* </form> */}
      </>
    );
  }
}
