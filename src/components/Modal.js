import React from 'react';
import { Modal as AntModal } from 'antd';

const Modal = ({ children, visible, footer, title, onClose, width }) => {
  return (
    <div>
      <AntModal
        destroyOnClose
        width={width}
        title={title}
        onCancel={() => onClose()}
        maskClosable={false}
        closable
        visible={visible}
        footer={footer}
      >
        {children}
      </AntModal>
    </div>
  );
};

export default Modal;
