import React from 'react';
import './AnalysisModal.css'; // 我們稍後會建立這個 CSS 檔案

const AnalysisModal = ({ data, onClose }) => {
  if (!data) return null;

  // 格式化數字，加上千分位
  const formatNumber = (num) => parseFloat(num).toLocaleString('en-US');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>毛利分析</h2>
        <ul>
          <li><strong>專案總毛利:</strong> ${formatNumber(data.overall_profit)}</li>
          <hr />
          <li>A 合約毛利 (部門視角): ${formatNumber(data.profit_a)}</li>
          <li>B 合約毛利 (部門視角): ${formatNumber(data.profit_b)}</li>
        </ul>
        <button onClick={onClose}>關閉</button>
      </div>
    </div>
  );
};

export default AnalysisModal;