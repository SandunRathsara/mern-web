import React from 'react';
import { Carousel as AntCarousel } from 'antd';

const Carousel = ({ images }) => {
  const contentList = images.map((img, i) => {
    return <img alt="" src={img} key={i} />;
  });

  return <AntCarousel autoplay>{contentList}</AntCarousel>;
};

export default Carousel;
