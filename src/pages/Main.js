import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';

import Header from '../components/header/Header';
import Footer from '../components/Footer';
import Content from '../components/Content';
import { getAuthData, logout } from '../store/auth_reducer';

const Main = ({ children, buttonLoading, logout }) => {
  const { user } = getAuthData();

  return (
    <Layout>
      <Header buttonLoading={buttonLoading} logout={logout} user={user} />
      <Content>{children}</Content>
      <Footer />
    </Layout>
  );
};

export default connect(state => ({ buttonLoading: state.auth.buttonLoading }), { logout })(Main);
