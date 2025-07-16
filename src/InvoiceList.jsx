import React, { useState, useEffect } from 'react';
import { getContractItems, createContractItem } from './api';

const InvoiceList = ({ contractId }) => {
  const [invoices, setInvoices] = useState([]);
  // 這裡可以加入新增發票的表單狀態

  useEffect(() => {
    if (contractId) {
      getContractItems(contractId, 'invoices').then(setInvoices);
    }
  }, [contractId]);

  return (
    <div>
      <h4>發票資訊</h4>
      <ul>
        {invoices.map(i => (
          <li key={i.id}>
            {i.invoice_number}: ${parseFloat(i.amount).toLocaleString()}
          </li>
        ))}
      </ul>
      {/* 未來可以在這裡加入新增發票的表單 */}
    </div>
  );
};

export default InvoiceList;