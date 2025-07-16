import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 引入新的 API 函式
import { getSettlementData, performSettlement } from './api';
import './SettlementPage.css';

const SettlementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  // --- 獎金相關狀態 ---
  const [bonusRate, setBonusRate] = useState(10); // 預設獎金比率 10%
  const [bonusA, setBonusA] = useState(0);
  const [bonusB, setBonusB] = useState(0);
  const [totalBonus, setTotalBonus] = useState(0);

  useEffect(() => {
    setLoading(true);
    getSettlementData(id)
      .then(fetchedData => {
        setData(fetchedData);
      })
      .catch(err => {
        console.error(err);
        setError('無法載入結算資料，請確認後端 API (settlement-data) 是否已準備就緒。');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // --- 計算邏輯 ---
  const calculateMetrics = () => {
    if (!data) return {};
    const { contract_a, costs_a, contracts_b, costs_b } = data;

    const total_cost_a = costs_a.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const total_amount_b = contracts_b.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const total_cost_b = costs_b.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const profit_a = parseFloat(contract_a.amount) - total_cost_a - total_amount_b;
    const profit_b = total_amount_b - total_cost_b;
    const overall_profit = parseFloat(contract_a.amount) - total_cost_a - total_cost_b;
    
    return { contract_a, total_cost_a, total_amount_b, total_cost_b, profit_a, profit_b, overall_profit };
  };

  const metrics = calculateMetrics();

  // 當資料或獎金比率變更時，重新計算總獎金
  useEffect(() => {
    if (metrics.overall_profit) {
      const newTotalBonus = metrics.overall_profit * (bonusRate / 100);
      setTotalBonus(newTotalBonus);
      // 預設平均分配
      setBonusA(newTotalBonus / 2);
      setBonusB(newTotalBonus / 2);
    }
  }, [data, bonusRate, metrics.overall_profit]);


  // --- 處理獎金分配輸入 ---
  const handleBonusChange = (setter, value) => {
    const numValue = parseFloat(value) || 0;
    if (setter === 'A') {
      setBonusA(numValue);
      setBonusB(totalBonus - numValue);
    } else { // setter === 'B'
      setBonusB(numValue);
      setBonusA(totalBonus - numValue);
    }
  };

  // --- 執行結算 ---
  const handleSettle = async () => {
    if (Math.abs(bonusA + bonusB - totalBonus) > 0.01) {
        alert('獎金分配總額不符，請重新確認。');
        return;
    }
    if (!window.confirm('確定要完成結算嗎？結算後所有資料將被鎖定。')) {
        return;
    }

    const settlementPayload = {
        bonus_total_amount: totalBonus,
        bonus_split_a: bonusA,
        bonus_split_b: bonusB,
    };

    try {
        await performSettlement(id, settlementPayload);
        alert('合約結算成功！');
        navigate('/'); // 跳轉回合約列表
    } catch (err) {
        setError(`結算失敗: ${err.message}`);
    }
  };


  if (loading) return <div>正在載入結算資料...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!data) return <div>沒有可供結算的資料。</div>;

  return (
    <div className="settlement-container">
      <h2>合約結算 - {metrics.contract_a.name}</h2>
      
      <div className="settlement-grid">
        {/* 欄位一 */}
        <div className="settlement-column">
          <h3>原始合約 (專案總覽)</h3>
          <ul>
            <li><span>A 合約金額:</span> <span>${parseFloat(metrics.contract_a.amount).toLocaleString()}</span></li>
            <li><span>(A+B) 總成本:</span> <span>-${(metrics.total_cost_a + metrics.total_cost_b).toLocaleString()}</span></li>
            <li className="profit"><span>原始合約毛利:</span> <span>${metrics.overall_profit.toLocaleString()}</span></li>
          </ul>
           <div className="bonus-section">
                <hr/>
                <label>業務獎金總額 (毛利的 <input type="number" value={bonusRate} onChange={e => setBonusRate(e.target.value)} style={{width: '50px'}}/> %):</label>
                <strong> ${totalBonus.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
            </div>
        </div>

        {/* 欄位二 */}
        <div className="settlement-column">
          <h3>A 合約 (A 部門視角)</h3>
          <ul>
            <li><span>A 合約金額:</span> <span>${parseFloat(metrics.contract_a.amount).toLocaleString()}</span></li>
            <li><span>A 合約成本:</span> <span>-${metrics.total_cost_a.toLocaleString()}</span></li>
            <li><span>關聯 B 合約總額:</span> <span>-${metrics.total_amount_b.toLocaleString()}</span></li>
            <li className="profit"><span>A 合約毛利:</span> <span>${metrics.profit_a.toLocaleString()}</span></li>
          </ul>
           <div className="bonus-section">
                <hr/>
                <label>A 合約業務獎金: $ </label>
                <input type="number" value={bonusA} onChange={e => handleBonusChange('A', e.target.value)} />
            </div>
        </div>

        {/* 欄位三 */}
        <div className="settlement-column">
          <h3>B 合約 (B 部門視角)</h3>
          <ul>
            <li><span>B 合約總金額:</span> <span>${metrics.total_amount_b.toLocaleString()}</span></li>
            <li><span>B 合約總成本:</span> <span>-${metrics.total_cost_b.toLocaleString()}</span></li>
            <li className="profit"><span>B 合約毛利:</span> <span>${metrics.profit_b.toLocaleString()}</span></li>
          </ul>
            <div className="bonus-section">
                <hr/>
                <label>B 合約業務獎金: $ </label>
                <input type="number" value={bonusB} onChange={e => handleBonusChange('B', e.target.value)} />
            </div>
        </div>
      </div>

      <div className="actions">
        <button className="cancel-btn" onClick={() => navigate('/')}>取消</button>
        {/* 儲存按鈕暫時移除，合併到結算功能中
        <button className="save-btn">儲存獎金分配</button> 
        */}
        <button className="settle-btn" onClick={handleSettle}>完成結算</button>
      </div>
    </div>
  );
};

export default SettlementPage;
