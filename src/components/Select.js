import React from 'react';
import { Select as AntSelect } from 'antd';
import _ from 'lodash';

const Select = ({
  itemList = [],
  placeholder,
  onChange,
  allowClear,
  isObjectArray = true,
  key = 'name',
  customFilter = _ => true,
  style,
  disabled,
  loading,
}) => {
  const filter = (input, option) => {
    if (input && option.children) {
      return _.includes(_.join(option.children, '').toLowerCase(), input.toLowerCase());
    }
    return false;
  };

  const onDropDownChange = index => {
    if (index >= 0 || index !== undefined) {
      return onChange(itemList[index]);
    }
    onChange(null);
  };

  return (
    <AntSelect
      allowClear={allowClear}
      style={{ width: '100%', ...style }}
      showSearch
      placeholder={placeholder}
      onChange={onDropDownChange}
      filterOption={filter}
      disabled={disabled}
      loading={loading}
    >
      {itemList.map((obj, i) => {
        if (!customFilter(obj)) {
          return null;
        }
        return (
          <AntSelect.Option key={i} value={i}>
            {isObjectArray ? obj[key] : obj}
          </AntSelect.Option>
        );
      })}
    </AntSelect>
  );
};

export default Select;
