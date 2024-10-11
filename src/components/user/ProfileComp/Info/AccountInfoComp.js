import React, { Component } from "react";
import ChangeInfoModal from "../../Modal/ChangeInfoModal";
import { Modal, Input, Ripple, initTWE } from "tw-elements";
import { storage } from "../../StorageImageText/TxtImageConfig";
import { listAll, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";

export default class AccountInfoComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      res: {},
      selectedFile: null, // Dùng để lưu ảnh đã chọn
      imageUrl: "",
    };
    // this.handleLogout = this.handleLogout.bind(this);
  }
  
  handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      toast.error("Vui lòng chọn ảnh để tải lên");
      return;
    }

    const imageRef = ref(storage, `images/${selectedFile.name}`);
    try {
      // Upload ảnh lên Firebase
      const snapshot = await uploadBytes(imageRef, selectedFile);
      const url = await getDownloadURL(snapshot.ref);
      this.setState({ imageUrl: url });

      // Gửi URL ảnh đến API backend để lưu vào cơ sở dữ liệu
      const token = localStorage.getItem("jwtToken");
      const decoded = jwtDecode(token);
      const id_user = decoded.id_user;

      await axios.post(
        "http://localhost:8080/user/api/info/upload",
        {
          userId: id_user,
          imageUrl: url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the user state with the new image URL
      this.setState((prevState) => ({
        user: { ...prevState.user, image_user: url },
      }));

      toast.success("Cập nhật ảnh đại diện thành công");
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      toast.error("Lỗi khi upload ảnh");
    }
  };

  handleUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      toast.error("Vui lòng chọn ảnh để tải lên");
      return;
    }

    const imageRef = ref(storage, `images/${selectedFile.name}`);
    try {
      // Upload ảnh lên Firebase
      const snapshot = await uploadBytes(imageRef, selectedFile);
      const url = await getDownloadURL(snapshot.ref);
      this.setState({ imageUrl: url });

      // Gửi URL ảnh đến API backend để lưu vào cơ sở dữ liệu
      const token = localStorage.getItem("jwtToken");
      const decoded = jwtDecode(token);
      const id_user = decoded.id_user;

      await axios.post(
        "http://localhost:8080/user/api/info/upload",
        {
          userId: id_user,
          imageUrl: url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the user state with the new image URL
      this.setState((prevState) => ({
        user: { ...prevState.user, image_user: url },
      }));

      toast.success("Cập nhật ảnh đại diện thành công");
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      toast.error("Lỗi khi upload ảnh");
    }
  };

  async componentDidMount() {
    initTWE({ Modal, Ripple, Input }, { allowReinits: true });
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      this.props.history.push("/login");
      return;
    }
    if (token) {
      const decoded = jwtDecode(token);
      this.setState({ user: decoded });

      const id_user = decoded.id_user;
      try {
        let res = await axios.get(
          `http://localhost:8080/user/api/info/${id_user}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.setState({ res: res ? res.data : [] });
        // console.log(res.data); // Handle the response as needed
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
  }

  render() {
    const { res, user } = this.state;
    const avatarUrl = user.image_user || res.image_user || "https://default-avatar-url";
    const email = user.email || res.email ;
    return (
      <>
        <section class=" py-3 bg-opacity-50 ">
          <div class="mx-auto container max-w-4xl md:w-3/4 shadow-md">
            <div className="bg-gray-100 p-4 border-t-2 border-indigo-400 rounded-t">
              <div className="max-w-xl mx-auto md:w-full md:mx-0">
                <div className="inline-flex items-center space-x-4">
                  <img
                    className="w-6/12 h-6/12 object-cover rounded-full"
                    alt="User avatar"
                    src={avatarUrl}
                  />
                  <h1 className="w-full inline-block text-gray-600 font-bold uppercase font-mono text-2xl">
                    {res.fullName}
                  </h1>
                </div>
                <div className="items-center w-6/12">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-center">
                      <label>
                        <input
                          type="file"
                          hidden
                          onChange={this.handleFileChange} // Tải lên ngay khi chọn ảnh
                        />
                        <div className="flex w-28 h-9 px-2 flex-col bg-gray-700 rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
                          Đổi ảnh đại diện
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-white space-y-6 text-start">
              <div class="md:inline-flex space-y-4 md:space-y-0 w-full p-4 text-gray-500 items-center">
                <h2 class="md:w-1/3 max-w-sm mx-auto">Tài khoản</h2>
                <div class="md:w-2/3 max-w-sm mx-auto">
                  <label class="text-sm text-gray-400">Email</label>
                  <div class="w-full inline-flex border">
                    <div class="pt-2 w-1/12 bg-gray-100 bg-opacity-50">
                      <svg
                        fill="none"
                        class="w-6 text-gray-400 mx-auto"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      class="w-11/12 focus:outline-none focus:text-gray-600 p-2"
                      placeholder="email@example.com"
                      value={email}
                    />
                  </div>
                </div>
              </div>

              <hr />
              <div class="md:inline-flex  space-y-4 md:space-y-0  w-full p-4 text-gray-500 items-center">
                <h2 class="md:w-1/3 mx-auto max-w-sm">Thông tin cá nhân</h2>
                <div class="md:w-2/3 mx-auto max-w-sm space-y-5">
                  <div className="text-start">
                    <label class="text-sm text-gray-400">Tên đầy đủ</label>
                    <div class="w-full inline-flex border">
                      <div class="w-1/12 pt-2 bg-gray-100">
                        <svg
                          fill="none"
                          class="w-6 text-gray-400 mx-auto"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        class="w-11/12 focus:outline-none focus:text-gray-600 p-2"
                        placeholder="Charly Olivas"
                        value={res.fullName}
                      />
                    </div>
                  </div>
                  <div className="text-start">
                    <label class="text-sm text-gray-400">Số điện thoại</label>
                    <div class="w-full inline-flex border">
                      <div class="pt-2 w-1/12 bg-gray-100">
                        <svg
                          fill="none"
                          class="w-6 text-gray-400 mx-auto"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        class="w-11/12 focus:outline-none focus:text-gray-600 p-2"
                        placeholder="12341234"
                        value={res.phone}
                      />
                    </div>
                  </div>

                  <div className="text-start">
                    <label className="text-sm text-gray-400 uppercase">
                      Giới tính
                    </label>
                    <div> {res.gender === true ? "Nam" : "Nu"}</div>
                  </div>

                  <div className="text-start">
                    <label class="text-sm text-gray-400">Ngày sinh</label>
                    <div class="w-full inline-flex border">
                      <input
                        type="text"
                        class="w-full focus:outline-none focus:text-gray-600 p-2"
                        // placeholder="12341234"
                        value={res.birthday}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <hr />
              <div class="w-full flex p-4 text-right text-gray-500">
                <button
                  type="button"
                  class="inline-block rounded bg-gray-700 p-3 me-5 w-6/12 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                >
                  Quay lại
                </button>

                {/* <!-- Button trigger modal --> */}
                <button
                  type="button"
                  className="inline-block rounded bg-gray-500 p-3 me-5 w-6/12 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                  data-twe-toggle="modal"
                  data-twe-target="#exampleModal"
                  data-twe-ripple-init
                  data-twe-ripple-color="light"
                >
                  Đổi thông tin
                </button>

                {/* <!-- Modal --> */}
                <div
                  data-twe-modal-init
                  class="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                  id="exampleModal"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <form>
                    <div
                      data-twe-modal-dialog-ref
                      class="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]"
                    >
                      <div class="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
                        <div class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 p-4 dark:border-white/10">
                          <h5
                            class="text-xl font-medium leading-normal text-surface dark:text-white"
                            id="exampleModalLabel"
                          >
                            Thay đổi thông tin
                          </h5>
                          <button
                            type="button"
                            class="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                            data-twe-modal-dismiss
                            aria-label="Close"
                          >
                            <span class="[&>svg]:h-6 [&>svg]:w-6">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </span>
                          </button>
                        </div>

                        {/* <!-- Modal body --> */}
                        <div
                          class="relative flex-auto p-4"
                          data-twe-modal-body-ref
                        >
                          <ChangeInfoModal />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}
