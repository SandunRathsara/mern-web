import React from 'react';
import { Layout, Menu } from 'antd';
import { LogoutOutlined, UserOutlined, HomeOutlined, UsergroupAddOutlined } from '@ant-design/icons';
// noinspection ES6CheckImport
import { useHistory } from 'react-router-dom';
import _ from 'lodash';

import './Header.css';

const Header = ({ logout, buttonLoading, user }) => {
  const history = useHistory();

  const onLogout = () => {
    logout(history);
  };

  return (
    <Layout.Header className="headerStyle">
      <div className="logo">
        <img width={100} height={60} src={require('../../assets/logo.png')} alt="Logo" />
      </div>

      <Menu mode="horizontal" selectable={false} triggerSubMenuAction={'click'}>
        {/*{routes.map((route, i) => {*/}
        {/*  return (*/}
        {/*    <Menu.Item className={'menu-auto-width'} key={i}>*/}
        {/*      <Link to={route.route}>{route.name}</Link>*/}
        {/*    </Menu.Item>*/}
        {/*  );*/}
        {/*})}*/}
        <Menu.Item className={'menu-auto-width'} onClick={() => onLogout()} style={{ float: 'right' }}>
          <LogoutOutlined spin={buttonLoading} />
          Logout
        </Menu.Item>
        <Menu.Item className={'menu-auto-width'} style={{ float: 'right' }} icon={<HomeOutlined />}>
          {user ? `${user.department.name}` : ''}
        </Menu.Item>
        <Menu.Item className={'menu-auto-width'} style={{ float: 'right' }} icon={<UsergroupAddOutlined />}>
          {user ? `${_.map(user.roles, 'name').join(', ')}` : ''}
        </Menu.Item>
        <Menu.Item className={'menu-auto-width'} style={{ float: 'right' }} icon={<UserOutlined />}>
          {user ? `${user.name}` : ''}
        </Menu.Item>
      </Menu>
    </Layout.Header>
  );
};

export default Header;
