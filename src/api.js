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

// --- 以下是合併了兩個分支的新函式 ---

// from stage-1
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

// from stage-1
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

// from stage-1
export const deleteContractItem = async (itemType, itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/${itemType}/${itemId}/`, {
      method: 'DELETE',
    });
    if (response.status !== 204 && !response.ok) {
        throw new Error(`刪除 ${itemType} 失敗`);
    }
  } catch (error) {
    console.error(`刪除 ID 為 ${itemId} 的項目失敗:`, error);
    throw error;
  }
};

// from stage-2
export const getSettlementData = async (contractId) => {
  try {
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

// from stage-2
export const performSettlement = async (contractId, settlementData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/settlement/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settlementData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '執行結算失敗');
    }
    return await response.json();
  } catch (error) {
    console.error(`執行合約 ${contractId} 的結算失敗:`, error);
    throw error;
  }
};
