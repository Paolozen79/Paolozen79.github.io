import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  note: string;
  date: string;
}

const STORAGE_KEY = '@transactions';

export const saveTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
  try {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const transactions = existingData ? JSON.parse(existingData) : [];

    transactions.push(newTransaction);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return newTransaction;
  } catch (e) {
    console.error('Failed to save transaction', e);
    throw e;
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to fetch transactions', e);
    return [];
  }
};

export const clearTransactions = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear transactions', e);
  }
};
