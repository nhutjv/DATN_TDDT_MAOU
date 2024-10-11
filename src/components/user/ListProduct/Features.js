import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShippingFast, faGift, faAward, faHeadset } from '@fortawesome/free-solid-svg-icons';

const features = [
  {
    icon: faShippingFast,
    title: 'Miễn phí vận chuyển',
    description: 'Nhận hàng trong vòng 3 ngày',
  },
  {
    icon: faGift,
    title: 'Quà tặng hấp dẫn',
    description: 'Nhiều ưu đãi khuyến mãi hot',
  },
  {
    icon: faAward,
    title: 'Bảo đảm chất lượng',
    description: 'Sản phẩm đã được kiểm định',
  },
  {
    icon: faHeadset,
    title: 'Hotline: 19001993',
    description: 'Dịch vụ hỗ trợ bạn 24/7',
  },
];

function Feature({ icon, title, description }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="text-blue-400 text-3xl">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="flex justify-around py-8 bg-white">
      {features.map((feature, index) => (
        <Feature key={index} {...feature} />
      ))}
    </div>
  );
}

export default Features;
