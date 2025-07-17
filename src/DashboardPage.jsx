import React, { useState, useEffect } from 'react';
import { getContracts, getContractAnalysis } from './api';
// 從 recharts 引入 PieChart, Pie, Cell 等新元件
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashboardPage.css';

// 為圓餅圖定義不同狀態的顏色
const COLORS = {
  IN_PROGRESS: '#0088FE',
  COMPLETED: '#00C49F',
  SETTLED: '#FFBB28',
  OVERDUE: '#FF8042',
};

const DashboardPage = () => {
  const [contracts, setContracts] = useState([]);
  const [profitData, setProfitData] = useState([]);
  // 新增一個 state 來存放進度圖表的資料
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const allContracts = await getContracts();
        setContracts(allContracts);

        // --- 計算毛利數據 (維持不變) ---
        const aContracts = allContracts.filter(c => c.type === 'A');
        const analysisPromises = aContracts.map(c => getContractAnalysis(c.id));
        const analysisResults = await Promise.all(analysisPromises);
        const formattedProfitData = aContracts.map((contract, index) => ({
          name: contract.name,
          '專案總毛利': analysisResults[index].overall_profit, 
        }));
        setProfitData(formattedProfitData);

        // --- 新增：計算進度數據 ---
        const statusCounts = allContracts.reduce((acc, contract) => {
          const status = contract.status || 'UNKNOWN';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const formattedProgressData = Object.keys(statusCounts).map(status => ({
          name: status,
          value: statusCounts[status],
        }));
        setProgressData(formattedProgressData);
        
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
            <BarChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="專案總毛利" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* --- 新增的圖表二：進度模式 --- */}
        <div className="dashboard-card">
          <h3>合約進度分佈</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={progressData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} 份`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
