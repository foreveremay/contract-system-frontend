import React, { useState, useEffect } from 'react';
import { getContractItems, createContractItem } from './api';

const PaymentList = ({ contractId }) => {
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]); // 預設為今天

  const fetchPayments = () => {
    if (contractId) {
      getContractItems(contractId, 'payments').then(setPayments);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [contractId]);

  const handleAddPayment = async (e) => {
    e.preventDefault();
    const newPayment = { 
        contract: contractId, 
        amount, 
        payment_date: paymentDate 
    };
    await createContractItem(contractId, 'payments', newPayment);
    // 新增成功後，重新載入列表並清空表單
    fetchPayments();
    setAmount('');
  };

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
      <form onSubmit={handleAddPayment} style={{ marginTop: '10px' }}>
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="付款金額"
          required
          style={{ marginLeft: '10px' }}
        />
        <button type="submit" style={{ marginLeft: '10px' }}>新增付款</button>
      </form>
    </div>
  );
};

export default PaymentList;
