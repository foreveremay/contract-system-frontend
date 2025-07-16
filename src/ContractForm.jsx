import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContractById, createContract, updateContract, getClients, getCategories } from './api';

// 引入新建立的元件
import CostList from './CostList.jsx';
import PaymentList from './PaymentList.jsx';
import InvoiceList from './InvoiceList.jsx';

const ContractForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState({
    name: '',
    contract_number: '',
    type: 'A',
    status: 'IN_PROGRESS',
    amount: '',
    start_date: '',
    end_date: '',
    is_stamped: false,
    client: '',
    category: '',
    parent_contract: null,
  });

  const [clients, setClients] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(id);

  useEffect(() => {
    getClients().then(setClients).catch(() => setError('無法載入客戶資料'));
    getCategories().then(setCategories).catch(() => setError('無法載入合約類型'));

    if (isEditing) {
      setLoading(true);
      getContractById(id)
        .then(data => {
          setContract({
            ...data,
            start_date: data.start_date || '',
            end_date: data.end_date || '',
            client: data.client || '',
            category: data.category || '',
          });
        })
        .catch(() => setError('無法載入合約資料'))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setContract(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract.client) {
      setError('請務必選擇一個客戶。');
      return;
    }
    setLoading(true);
    setError('');
    const dataToSubmit = {
      ...contract,
      start_date: contract.start_date || null,
      end_date: contract.end_date || null,
      category: contract.category || null,
    };

    try {
      if (isEditing) {
        await updateContract(id, dataToSubmit);
      } else {
        await createContract(dataToSubmit);
      }
      navigate('/');
    } catch (err) {
      setError('儲存失敗，請檢查所有必填欄位。');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div>正在載入表單...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', textAlign: 'left' }}>
      <h1>{isEditing ? '編輯合約' : '新增合約'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label>客戶 (公司名稱):</label>
          <select name="client" value={contract.client} onChange={handleChange} required>
            <option value="">-- 請選擇客戶 --</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.company_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>合約名稱:</label>
          <input type="text" name="name" value={contract.name} onChange={handleChange} required />
        </div>
        
        <div>
          <label>合約編號:</label>
          <input type="text" name="contract_number" value={contract.contract_number} onChange={handleChange} />
        </div>

        <div>
          <label>合約類型:</label>
          <select name="category" value={contract.category} onChange={handleChange}>
            <option value="">-- 請選擇類型 --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label>合約金額:</label>
          <input type="number" name="amount" value={contract.amount} onChange={handleChange} required placeholder="例如: 500000" />
        </div>
        
        <div>
          <label>合約主/追加:</label>
          <select name="type" value={contract.type} onChange={handleChange}>
            <option value="A">A (主合約)</option>
            <option value="B">B (追加合約)</option>
          </select>
        </div>
        
        <div>
          <label>開始日期:</label>
          <input type="date" name="start_date" value={contract.start_date} onChange={handleChange} />
        </div>
        
        <div>
          <label>結束日期:</label>
          <input type="date" name="end_date" value={contract.end_date} onChange={handleChange} />
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <button type="submit" disabled={loading}>
            {loading ? '儲存中...' : '儲存'}
          </button>
          <button type="button" onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>取消</button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {/* --- 新增的區塊 --- */}
      {/* 只有在編輯模式時，才顯示附屬項目管理 */}
      {isEditing && (
        <div style={{ marginTop: '40px' }}>
          <hr />
          <CostList contractId={id} />
          <hr />
          <PaymentList contractId={id} />
          <hr />
          <InvoiceList contractId={id} />
        </div>
      )}
    </div>
  );
};

export default ContractForm;
