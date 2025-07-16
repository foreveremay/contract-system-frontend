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
