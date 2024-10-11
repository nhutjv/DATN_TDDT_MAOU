import React from 'react';
import CouponCard from './CouponCard';  // Import CouponCard

function CouponsList() {
  const coupons = [
    {
      code: 'EGA10',
      discount: '10%',
      description: 'Mã giảm 10% cho đơn hàng tối thiểu 1500k',
    },
    {
      code: 'EGA15',
      discount: '15%',
      description: 'Mã giảm 15% cho đơn hàng tối thiểu 200k',
    },
    {
      code: 'EGA99',
      discount: '99k',
      description: 'Giảm giá 99k các sản phẩm Áo thun',
    },
    {
      code: 'EGA',
      discount: 'Ship',
      description: 'Miễn phí ship tối thiểu 500k',
    },
  ];

  return (
    <div className="ms-2 mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
      {coupons.map((coupon, index) => (
        <CouponCard
          key={index}
          code={coupon.code}
          discount={coupon.discount}
          description={coupon.description}
        />
      ))}
    </div>
  );
}

export default CouponsList;
