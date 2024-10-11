import React from 'react';

class ShockDeals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 8,  // Number of deals per page
    };
  }

  handleViewVariantDetail = (variant) => {
    this.props.history.push(`/product/${variant.productId}`);
  };

  handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= this.getTotalPages()) {
      this.setState({ currentPage: newPage });
    }
  };

  getTotalPages = () => {
    const { shockDeals } = this.props;
    return Math.ceil(shockDeals.length / this.state.pageSize);
  };

  render() {
    const { shockDeals } = this.props;
    const { currentPage, pageSize } = this.state;

    // Calculate the start and end index for the current page
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedDeals = shockDeals.slice(startIndex, startIndex + pageSize);

    return (
      <div className="mt-3">
        <h2 className="text-3xl text-center mb-4">DEAL SỐC</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {paginatedDeals.length > 0 ? (
            paginatedDeals.map((item, index) => (
              <div className="relative group" key={index}>
                <div
                  className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75"
                  onClick={() => this.handleViewVariantDetail(item)} 
                >
                  <img
                    onClick={() => this.handleViewVariantDetail(item)}
                    src={item.imageUrl}
                    alt={item.productName}
                    className="object-cover object-center w-full h-full group-hover:opacity-75 cursor-pointer"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-pretty text-gray-700">
                    <button onClick={() => this.handleViewVariantDetail(item)}>
                      {item.productName}
                    </button>
                  </h3>
                  <div className="flex items-center justify-start space-x-2">
                    <p className="text-lg text-blue-700 font-bold">{item.discountedPrice.toLocaleString()} đ</p>
                    <p className="text-sm text-gray-500 line-through">{item.originalPrice.toLocaleString()} đ</p>
                    <p className="bg-gradient-to-r to-red-700 from-orange-500 text-white px-2 py-1 text-xs rounded flex-shrink-0 ">
                      {item.discountPercent}%
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No Shock Deals Available</p>
          )}
        </div>

   
        <div className="flex justify-center items-center space-x-4 mt-4 mb-4">
      
          <button
            onClick={() => this.handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-lg text-gray-500 disabled:text-gray-300"
          >
            &laquo;
          </button>

          {Array.from({ length: this.getTotalPages() }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => this.handlePageChange(index + 1)}
              className={`w-8 h-8 flex justify-center items-center rounded-full text-md transition-all ${
                currentPage === index + 1
                  ? 'bg-black text-white font-bold'
                  : 'text-gray-600 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}

        
          <button
            onClick={() => this.handlePageChange(currentPage + 1)}
            disabled={currentPage === this.getTotalPages()}
            className="text-lg text-gray-500 disabled:text-gray-300"
          >
            &raquo;
          </button>
        </div>
      </div>
    );
  }
}

export default ShockDeals;
