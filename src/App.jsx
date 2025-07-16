import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ContractList from './ContractList.jsx';
import ContractForm from './ContractForm.jsx'; // 引入表單元件
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>合約管理系統</h1>
      </header>
      <main style={{ padding: '20px' }}>
        <Routes>
          {/* 主路徑 /，顯示合約列表 */}
          <Route path="/" element={<ContractList />} />
          
          {/* /new 路徑，顯示新增合約的表單 */}
          <Route path="/new" element={<ContractForm />} />
          
          {/* /:id/edit 路徑，顯示編輯合約的表單 */}
          <Route path="/:id/edit" element={<ContractForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;