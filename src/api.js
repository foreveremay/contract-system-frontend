// --- src/api.js ---

const API_BASE_URL = 'http://127.0.0.1:8000';

// --- 原有的函式 ---

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

// --- 新加入的函式 ---

/**
 * 通用的函式，用來獲取合約下的特定項目列表 (成本、付款、發票)
 * @param {string} contractId - 合約的 ID
 * @param {string} itemType - 項目的類型 ('costs', 'payments', 'invoices')
 * @returns {Promise<Array>}
 */
export const getContractItems = async (contractId, itemType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/${itemType}/`);
    if (!response.ok) throw new Error(`無法獲取 ${itemType} 列表`);
    return await response.json();
  } catch (error) {
    console.error(`獲取 ${itemType} 失敗:`, error);
    throw error;
  }
};

/**
 * 通用的函式，用來在合約下建立一個新的項目
 * @param {string} contractId - 合約的 ID
 * @param {string} itemType - 項目的類型 ('costs', 'payments', 'invoices')
 * @param {object} data - 要新增的項目資料
 * @returns {Promise<object>}
 */
export const createContractItem = async (contractId, itemType, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/${itemType}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`建立 ${itemType} 失敗`);
    return await response.json();
  } catch (error) {
    console.error(`建立 ${itemType} 失敗:`, error);
    throw error;
  }
};

/**
 * 通用的函式，用來刪除合約下的特定項目
 * @param {string} itemType - 項目的類型 ('costs', 'payments', 'invoices')
 * @param {string} itemId - 要刪除的項目 ID
 * @returns {Promise<void>}
 */
export const deleteContractItem = async (itemType, itemId) => {
  try {
    // 注意：後端 API 的路由可能是 /api/costs/{id}/ 或 /api/payments/{id}/
    const response = await fetch(`${API_BASE_URL}/api/${itemType}/${itemId}/`, {
      method: 'DELETE',
    });
    if (response.status !== 204 && !response.ok) { // 204 No Content 是成功的狀態
        throw new Error(`刪除 ${itemType} 失敗`);
    }
    // DELETE 通常沒有回傳內容，所以不用 return response.json()
  } catch (error) {
    console.error(`刪除 ID 為 ${itemId} 的項目失敗:`, error);
    throw error;
  }
};
