import React, { useState, useEffect } from 'react';
import { getContractItems, createContractItem } from './api';

const PaymentList = ({ contractId }) => {
  const [payments, setPayments] = useState([]);
  // 這裡可以加入新增付款的表單狀態

  useEffect(() => {
    if (contractId) {
      getContractItems(contractId, 'payments').then(setPayments);
    }
  }, [contractId]);

  return (
    <div>
      <h4>付款紀錄</h4>
      <ul>
        {payments.map(p => (
          <li key={p.id}>
            {p.payment_date}: ${parseFloat(p.amount).toLocaleString()}
          </li>
        ))}
      </ul>
      {/* 未來可以在這裡加入新增付款的表單 */}
    </div>
  );
};

export default PaymentList;
