import { Form, Input } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { resetPassword } from '../../store/auth_reducer';
import './resetPassword.css';

class ResetPassword extends React.Component {
  componentDidMount() {
    document.title = 'Password Reset';
  }

  onFinish = ({ password }) => {
    const { history } = this.props;
    this.props.resetPassword({ password }, history);
  };

  render() {
    const layout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const cover = <img src={require('../../assets/logo.png')} alt="Logo" />;

    return (
      <div className="main">
        <Card title="Password Reset" cover={cover}>
          <Form {...layout} onFinish={this.onFinish}>
            <Form.Item
              label="New Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password' },
                { min: 8, message: 'Password should contain at least 8 characters' },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please input your password again' },
                ({ getFieldValue }) => ({
                  validator: (rule, value) => {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Passwords do not match');
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button size="large" loading={this.props.buttonLoading} block type="primary" htmlType="submit">
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

const mapDispatchToProps = state => ({
  buttonLoading: state.shared.buttonLoading,
});

export default connect(mapDispatchToProps, {
  resetPassword,
})(ResetPassword);
