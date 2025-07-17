import React, { useState, useEffect } from 'react';
import { getContractItems, createContractItem } from './api';

const InvoiceList = ({ contractId }) => {
  const [invoices, setInvoices] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchInvoices = () => {
    if (contractId) {
      getContractItems(contractId, 'invoices').then(setInvoices);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [contractId]);

  const handleAddInvoice = async (e) => {
    e.preventDefault();
    const newInvoice = { 
        contract: contractId, 
        invoice_number: invoiceNumber,
        amount, 
        issue_date: issueDate
    };
    await createContractItem(contractId, 'invoices', newInvoice);
    fetchInvoices();
    setInvoiceNumber('');
    setAmount('');
  };

  return (
    <div>
      <h4>發票資訊</h4>
      <ul>
        {invoices.map(i => (
          <li key={i.id}>
            發票號碼: {i.invoice_number} / 金額: ${parseFloat(i.amount).toLocaleString()}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddInvoice} style={{ marginTop: '10px' }}>
        <input
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          required
        />
        <input
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          placeholder="發票號碼"
          required
          style={{ marginLeft: '10px' }}
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="發票金額"
          required
          style={{ marginLeft: '10px' }}
        />
        <button type="submit" style={{ marginLeft: '10px' }}>新增發票</button>
      </form>
    </div>
  );
};

export default InvoiceList;
