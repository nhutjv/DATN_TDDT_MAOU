import React from 'react';
import axios from 'axios';
import { storage } from '../StorageImageText/TxtImageConfig';
import { listAll, ref, getDownloadURL } from 'firebase/storage';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import Features from './Features';
import CouponsList from './CouponsList';
import FashionCategories from './FashionCategories';
import BrandLogos from './BrandLogos';
import NewsSection from './NewsSection';
import ShockDeals from './ShockDeals';
import ProductList from './ProductList';

class ListProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUpload: null,
      imageList: [],
      listProduct: [],
      shockDeals: [],
      newProducts: [],
      currentPage: 1,
      pageSize: 8,
      totalPages: 0,
    };
    this.imageListRef = ref(storage, 'images/');
    this.fetchImageList = this.fetchImageList.bind(this);
  }

  async componentDidMount() {
    try {
      let productRes = await axios.get('http://localhost:8080/user/api/products1');
      const products = productRes ? productRes.data : [];
      const totalPages = Math.ceil(products.length / this.state.pageSize);

      this.setState({
        listProduct: products,
        totalPages,
      });

      let saleRes = await axios.get('http://localhost:8080/user/api/variants/onsale');
      const shockDeals = Array.isArray(saleRes.data) ? saleRes.data : [];
      const newProducts = products.filter((product) => product.isNew);
      this.setState({ shockDeals, newProducts });
      
      this.fetchImageList();
    } catch (error) {
      console.error('Error fetching products or deals:', error);
    }
  }

  fetchImageList() {
    listAll(this.imageListRef).then((response) => {
      const fetchUrls = response.items.map((item) => getDownloadURL(item));
      Promise.all(fetchUrls).then((urls) => {
        this.setState({ imageList: urls });
      });
    });
  }

  handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= this.state.totalPages) {
      this.setState({ currentPage: newPage });
    }
  };

  handleViewDetail = (item) => {
    this.props.history.push(`/product/${item.id}`);
  };

  render() {
    const { listProduct, shockDeals, currentPage, pageSize, totalPages } = this.state;
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = listProduct.slice(startIndex, startIndex + pageSize);
    console.log(shockDeals)
    return (
      <>
        <div className="deal-section  mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-4">
          {/* mgg */}
          <CouponsList />
          {/* ttkm */}
          <Features />
          {/* dm */}
          <FashionCategories />
          {/* sale */}
          <ShockDeals shockDeals={shockDeals} history={this.props.history} />
        </div>

        {/* bn1 */}
        <div className="banner-section mx-auto max-w-7xl  px-4 py-4 sm:px-6 sm:py-4">
          <div className="flex justify-center items-center bg-green-100">
            <div className="text-center">
              <h2 className="text-4xl font-bold">Áo Phông Đa Sắc Màu</h2>
              <p className="mt-2 text-lg">Đón nắng hè rực rỡ</p>
              <p>Cotton USA cao cấp - Co giãn đa chiều</p>
            </div>
            <img
              src="https://media.canifa.com/Simiconnector/Ao_phong_block_home_desktop-29.07.webp"
              alt="Áo Phông Đa Sắc Màu"
              className="h-64 object-cover"
            />
          </div>
        </div>

        {/* danh sách sản phẩm */}
        <ProductList products={paginatedProducts} onProductClick={this.handleViewDetail} />

        {/* bn2 */}
        <div className="banner-section mx-auto max-w-7xl  px-4 py-4 sm:px-6 sm:py-4">
          <img
            src="https://theme.hstatic.net/200000696635/1001257291/14/imgtext_2_img.jpg?v=100"
            alt="Áo Phông Đa Sắc Màu"
          />
        </div>
        <div className='px-3'>
           {/* thương hiệu */}
        <BrandLogos />
        </div>

       
        {/* tin tức */}
        <NewsSection />
      </>
    );
  }
}

export default withRouter(ListProduct);
