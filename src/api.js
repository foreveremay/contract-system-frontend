const API_BASE_URL = 'http://127.0.0.1:8000';

export const getContracts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contracts/`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Fetching contracts failed:", error);
    throw error;
  }
};

export const getContractAnalysis = async (contractId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/analysis/`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Fetching analysis for contract ${contractId} failed:`, error);
    throw error;
  }
};

export const getContractById = async (contractId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching contract ${contractId}:`, error);
    throw error;
  }
};

export const createContract = async (contractData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contracts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contractData),
    });
    if (!response.ok) throw new Error('Failed to create contract');
    return await response.json();
  } catch (error) {
    console.error('Error creating contract:', error);
    throw error;
  }
};

export const updateContract = async (contractId, contractData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contractData),
    });
    if (!response.ok) throw new Error('Failed to update contract');
    return await response.json();
  } catch (error) {
    console.error(`Error updating contract ${contractId}:`, error);
    throw error;
  }
};

export const getClients = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/`);
    if (!response.ok) throw new Error('Failed to fetch clients');
    return await response.json();
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
// --- 請將此函式加入到 src/api.js 的最下方 ---

/**
 * 獲取結算頁面所需的所有資料
 * 後端應提供一個 API 端點，一次性回傳主合約、所有關聯的 B 合約及所有相關成本
 * @param {string} contractId - 主合約 A 的 ID
 * @returns {Promise<object>}
 */
export const getSettlementData = async (contractId) => {
  try {
    // 為了簡化前端操作，我們假設後端已提供一個優化過的 API
    // 實際上，後端可能需要組合多個查詢才能回傳這個結果
    const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/settlement-data/`);
    if (!response.ok) {
      throw new Error('無法獲取結算資料，請確認後端 API 是否已準備就緒。');
    }
    return await response.json();
  } catch (error) {
    console.error(`獲取合約 ${contractId} 的結算資料失敗:`, error);
    throw error;
  }
};
/**
 * 執行結算，將最終的獎金分配等資料送到後端
 * @param {string} contractId - 主合約 A 的 ID
 * @param {object} settlementData - 包含獎金分配資訊的物件
 * @returns {Promise<object>}
 */
export const performSettlement = async (contractId, settlementData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/settlement/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settlementData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        // 讓錯誤訊息更詳細
        throw new Error(errorData.detail || '執行結算失敗');
    }
    return await response.json();
  } catch (error) {
    console.error(`執行合約 ${contractId} 的結算失敗:`, error);
    throw error;
  }
};
