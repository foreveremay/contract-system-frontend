import React, { useState, useEffect } from 'react';
import { getContracts, getContractAnalysis } from './api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashboardPage.css';

const DashboardPage = () => {
  const [contracts, setContracts] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const allContracts = await getContracts();
        setContracts(allContracts);

        // --- 計算毛利數據 ---
        // 只針對 A 合約計算
        const aContracts = allContracts.filter(c => c.type === 'A');
        
        // 使用 Promise.all 平行獲取所有 A 合約的分析資料
        const analysisPromises = aContracts.map(c => getContractAnalysis(c.id));
        const analysisResults = await Promise.all(analysisPromises);

        const formattedProfitData = aContracts.map((contract, index) => ({
          name: contract.name,
          // 'overall_profit' 是從後端 analysis API 來的欄位
          '專案總毛利': analysisResults[index].overall_profit, 
        }));

        setProfitData(formattedProfitData);
        
      } catch (err) {
        console.error(err);
        setError('無法載入儀表板資料');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <div>正在載入儀表板...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>儀表板</h2>
      <div className="dashboard-container">
        {/* 圖表一：毛利模式 */}
        <div className="dashboard-card">
          <h3>合約毛利總覽 (A合約)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={profitData}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="專案總毛利" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 其他圖表卡片可以加在這裡 */}
        <div className="dashboard-card">
          <h3>進度模式 (待開發)</h3>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
