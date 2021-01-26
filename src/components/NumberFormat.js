import React from 'react';
import NumFormat from 'react-number-format';

const NumberFormat = ({ value, currency }) => {
  if (currency) {
    currency = currency + ' ';
  }

  return (
    <NumFormat
      value={value}
      prefix={currency}
      displayType="text"
      thousandSeparator
      decimalScale={2}
      fixedDecimalScale
    />
  );
};

export default NumberFormat;
