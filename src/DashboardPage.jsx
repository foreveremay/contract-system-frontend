import React, { useState, useEffect } from 'react';
// **修正點：不再需要 getContractAnalysis**
import { getContracts, getSettlementData } from './api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashboardPage.css';

const COLORS = {
  IN_PROGRESS: '#0088FE',
  COMPLETED: '#00C49F',
  SETTLED: '#FFBB28',
  OVERDUE: '#FF8042',
};

const DashboardPage = () => {
  const [contracts, setContracts] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const allContracts = await getContracts();
        setContracts(allContracts);

        // --- 修正點：毛利數據計算邏輯 ---
        const aContracts = allContracts.filter(c => c.type === 'A');
        
        // **改為呼叫 getSettlementData**
        const settlementPromises = aContracts.map(c => getSettlementData(c.id));
        const settlementResults = await Promise.all(settlementPromises);

        const formattedProfitData = settlementResults.map((data) => {
          // **在前端計算專案總毛利**
          const { contract_a, costs_a, costs_b } = data;
          const total_cost_a = costs_a.reduce((sum, item) => sum + parseFloat(item.amount), 0);
          const total_cost_b = costs_b.reduce((sum, item) => sum + parseFloat(item.amount), 0);
          const overall_profit = parseFloat(contract_a.amount) - total_cost_a - total_cost_b;
          
          return {
            name: contract_a.name,
            '專案總毛利': overall_profit,
          };
        });
        setProfitData(formattedProfitData);
        
        // --- 進度數據計算邏輯 (維持不變) ---
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
