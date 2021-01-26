import React from 'react';
import { Card as AntCard } from 'antd';

const Card = ({ cover, children, title }) => {
  return (
    <AntCard title={title} hoverable={true} bordered={true} style={{ width: 400, cursor: 'default' }} cover={cover}>
      {children}
    </AntCard>
  );
};

export default Card;
