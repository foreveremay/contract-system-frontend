import React from 'react';
// 引入 Link 以便建立導航連結
import { Routes, Route, Link } from 'react-router-dom';
import ContractList from './ContractList.jsx';
import ContractForm from './ContractForm.jsx';
import SettlementPage from './SettlementPage.jsx';
// 引入新建的儀表板頁面元件
import DashboardPage from './DashboardPage.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>合約管理系統</h1>
        {/* --- 新增的導航列 --- */}
        <nav style={{ padding: '10px 0', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <Link to="/" style={{ margin: '0 15px', textDecoration: 'none' }}>合約列表</Link>
          <Link to="/dashboard" style={{ margin: '0 15px', textDecoration: 'none' }}>儀表板</Link>
        </nav>
      </header>
      <main style={{ padding: '20px' }}>
        <Routes>
          {/* 主路徑 /，顯示合約列表 */}
          <Route path="/" element={<ContractList />} />
          
          {/* /new 路徑，顯示新增合約的表單 */}
          <Route path="/new" element={<ContractForm />} />
          
          {/* /:id/edit 路徑，顯示編輯合約的表單 */}
          <Route path="/:id/edit" element={<ContractForm />} />

          {/* /:id/settlement 路徑，顯示結算頁面 */}
          <Route path="/:id/settlement" element={<SettlementPage />} />

          {/* --- 新增的路由規則 --- */}
          {/* /dashboard 路徑，顯示儀表板頁面 */}
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
