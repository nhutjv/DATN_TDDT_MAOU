import React from 'react';
import Slider from 'react-slick';
import FashionCategoryCard from './FashionCategoryCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function FashionCategories() {
  const categories = [
    {
      title: 'Áo khoác',
      productCount: 8,
      image: 'https://firebasestorage.googleapis.com/v0/b/demoimg-2354e.appspot.com/o/variants%2F6tw23w005-sg031-1%20(1).webp?alt=media&token=f3c263f5-f14f-4169-a641-dff6362fbf8a',
    },
    {
      title: 'Áo sơ mi',
      productCount: 6,
      image: 'https://firebasestorage.googleapis.com/v0/b/demoimg-2354e.appspot.com/o/variants%2F8ts24c003-sw001-thumb.webp?alt=media&token=f65ac20d-02ee-45d5-93cc-2af79b070c8d',
    },
    {
      title: 'Áo thun',
      productCount: 7,
      image: 'https://firebasestorage.googleapis.com/v0/b/demoimg-2354e.appspot.com/o/variants%2F6ds22c016-cm059-2-b.webp?alt=media&token=703a0ee8-2f41-4aee-8724-b26af7ffdd0c',
    },
    {
      title: 'Quần dài nam',
      productCount: 5,
      image: 'https://firebasestorage.googleapis.com/v0/b/demoimg-2354e.appspot.com/o/variants%2F6tw23w005-se257-m-2%20(1).webp?alt=media&token=f8b679f2-6df8-4780-b962-e96fb519aca6',
    },
    {
      title: 'Quần jeans',
      productCount: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/demoimg-2354e.appspot.com/o/images%2F8bp24w004-sa889-1.webp?alt=media&token=27404151-cafa-423d-9b21-2e7f757616b3',
    },
    {
      title: 'Quần short',
      productCount: 5,
      image: 'https://firebasestorage.googleapis.com/v0/b/demoimg-2354e.appspot.com/o/images%2F6ds22c016-cm059-3-b.webp?alt=media&token=d881312c-3eb8-411f-bc1c-9f542de5e87e',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="py-8">
      <h2 className="text-3xl text-center  mb-8">THỜI TRANG MAOU</h2>
      <Slider {...settings}>
        {categories.map((category, index) => (
          <div key={index} className="px-2">
            <FashionCategoryCard
              title={category.title}
              productCount={category.productCount}
              image={category.image}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default FashionCategories;
