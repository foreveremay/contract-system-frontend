import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// 引入 updateContract API
import { getContracts, getContractAnalysis, updateContract } from './api.js';
import AnalysisModal from './AnalysisModal.jsx';

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContracts();
      setContracts(data || []); 
    } catch (err) {
      setError("無法載入合約資料，請確認後端伺服器是否已啟動。");
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // --- 新增的函式：處理狀態更新 ---
  const handleUpdateStatus = async (contract, newStatus) => {
    if (!window.confirm(`確定要將合約 "${contract.name}" 的狀態變更為 "${newStatus === 'COMPLETED' ? '已結案' : newStatus}" 嗎？`)) {
        return;
    }
    try {
        // 我們需要傳送完整的合約資料，只更新 status 欄位
        const updatedData = { ...contract, status: newStatus };
        await updateContract(contract.id, updatedData);
        // 更新成功後，重新載入列表
        fetchContracts(); 
    } catch (err) {
        alert('狀態更新失敗！');
    }
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

                  {/* --- 新增的按鈕 --- */}
                  {/* 只有 A 合約且狀態為「進行中」時，才顯示此按鈕 */}
                  {contract.type === 'A' && contract.status === 'IN_PROGRESS' && (
                    <button 
                      style={{ marginLeft: '5px' }}
                      onClick={() => handleUpdateStatus(contract, 'COMPLETED')}
                    >
                      標為已結案
                    </button>
                  )}
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
