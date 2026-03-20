import { useState, useEffect, useCallback } from 'react';
import type { CRMAccount } from '../data/crm';
import { fetchAllAccountsLive } from './supabase-adapter';
import { crmAccounts as hardcodedAccounts } from '../data/crm';

export function useAccounts() {
  const [accounts, setAccounts] = useState<CRMAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllAccountsLive();
      if (data.length > 0) {
        setAccounts(data);
      } else {
        console.warn('Supabase accounts empty, using hardcoded data');
        setAccounts(hardcodedAccounts);
      }
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
      setError('Failed to load accounts from database');
      setAccounts(hardcodedAccounts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  return { accounts, loading, error, refresh: loadAccounts };
}
