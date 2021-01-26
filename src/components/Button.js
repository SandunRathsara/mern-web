import React from 'react';
import { Button as AntButton } from 'antd';

const Button = ({
  onClick = () => {},
  children,
  loading,
  size,
  type,
  block,
  htmlType,
  danger,
  icon,
  disabled,
  style,
}) => {
  return (
    <AntButton
      disabled={disabled}
      style={{ borderRadius: '8px', ...style }}
      onClick={() => onClick()}
      loading={loading}
      size={size || 'default'}
      type={type || 'primary'}
      block={block}
      htmlType={htmlType}
      danger={danger}
      icon={icon}
    >
      {children}
    </AntButton>
  );
};

export default Button;
