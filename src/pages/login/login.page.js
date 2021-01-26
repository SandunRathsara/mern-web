import { Checkbox, Form, Input } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { getAuthStateFromToken, login, navigate } from '../../store/auth_reducer';
import './login.styles.css';

class LoginPage extends React.Component {
  async componentDidMount() {
    document.title = 'Login';

    if (getAuthStateFromToken()) {
      const { history } = this.props;
      return navigate('/home', history);
    }
  }

  onFinish = async ({ email, password, remember }) => {
    const { history } = this.props;
    this.props.login({ email, password, remember, history });
  };

  render() {
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const cover = <img src={require('../../assets/logo.png')} alt="Logo" />;

    return (
      <div className="main">
        <Card cover={cover}>
          <Form {...layout} name="basic" initialValues={{ remember: true }} onFinish={this.onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your e-mail!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 18, offset: 8 }} name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button size="large" loading={this.props.buttonLoading} block type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default connect(
  state => ({
    buttonLoading: state.auth.buttonLoading,
    azureButtonLoading: state.auth.azureButtonLoading,
    azureAuthReducer: state.azureAuthReducer,
  }),
  { login }
)(LoginPage);
