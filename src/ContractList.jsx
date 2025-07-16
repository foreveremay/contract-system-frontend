import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getContracts, getContractAnalysis } from './api.js';
import AnalysisModal from './AnalysisModal.jsx';

const ContractList = () => {
  const [contracts, setContracts] = useState([]); // 預設為一個空陣列
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getContracts();
        // 【修正】確保即使 data 是 null 或 undefined，contracts 也會是一個陣列
        setContracts(data || []); 
      } catch (err) {
        setError("無法載入合約資料，請確認後端伺服器是否已啟動。");
        setContracts([]); // 發生錯誤時也確保是空陣列
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  const handleAnalysisClick = async (contractId, contractType) => {
    if (contractType !== 'A') {
      alert('只有 A 合約可以查看專案總毛利分析。');
      return;
    }
    setLoadingAnalysis(true);
    setIsModalOpen(true);
    try {
      const data = await getContractAnalysis(contractId);
      setAnalysisData(data);
    } catch (err) {
      alert('無法獲取分析資料。');
      setIsModalOpen(false);
    } finally {
      setLoadingAnalysis(false);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setAnalysisData(null);
  };

  if (loading) return <div>正在載入中...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>合約列表</h1>
        <Link to="/new">
          <button>新增合約</button>
        </Link>
      </div>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>合約名稱</th>
            <th>客戶</th>
            <th>類型</th>
            <th>狀態</th>
            <th style={{ textAlign: 'right' }}>金額</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {/* 【修正】增加一個檢查，確保 contracts 是一個陣列才執行 map */}
          {Array.isArray(contracts) && contracts.length > 0 ? (
            contracts.map(contract => (
              <tr key={contract.id}>
                <td>{contract.name}</td>
                <td>{contract.client_name}</td>
                <td>{contract.type === 'A' ? 'A (主合約)' : 'B (追加合約)'}</td>
                <td>{contract.status}</td>
                <td style={{ textAlign: 'right' }}>{parseFloat(contract.amount).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleAnalysisClick(contract.id, contract.type)} disabled={contract.type !== 'A'}>
                    分析
                  </button>
                  <Link to={`/${contract.id}/edit`}>
                    <button style={{ marginLeft: '5px' }}>編輯</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">目前沒有任何合約資料。</td>
            </tr>
          )}
        </tbody>
      </table>
      {isModalOpen && (
        <AnalysisModal data={loadingAnalysis ? { overall_profit: '載入中...' } : analysisData} onClose={closeModal} />
      )}
    </div>
  );
};

export default ContractList;