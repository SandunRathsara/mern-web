import React from 'react';
import { Layout } from 'antd';

const Content = ({ children }) => {
  const { Content: AntContent } = Layout;

  return <AntContent style={{ margin: 5, padding: 20, background: '#ffffff' }}>{children}</AntContent>;
};

export default Content;
