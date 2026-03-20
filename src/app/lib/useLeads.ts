import { useState, useEffect, useCallback } from 'react';
import type { CRMLead, CRMDatabase } from '../data/crm';
import { fetchAllLeadsLive, fetchLeadsByDatabaseLive, fetchSalespeopleLive } from './supabase-adapter';
import { crmLeads as hardcodedLeads, crmSalespeople as hardcodedSalespeople } from '../data/crm';

export function useLeads(databaseFilter?: CRMDatabase) {
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = databaseFilter
        ? await fetchLeadsByDatabaseLive(databaseFilter)
        : await fetchAllLeadsLive();

      if (data.length > 0) {
        setLeads(data);
      } else {
        console.warn('Supabase returned empty, using hardcoded data');
        const fallback = databaseFilter
          ? hardcodedLeads.filter(l => l.database === databaseFilter)
          : hardcodedLeads;
        setLeads(fallback);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setError('Failed to load leads from database');
      const fallback = databaseFilter
        ? hardcodedLeads.filter(l => l.database === databaseFilter)
        : hardcodedLeads;
      setLeads(fallback);
    } finally {
      setLoading(false);
    }
  }, [databaseFilter]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  return { leads, loading, error, refresh: loadLeads };
}

export function useSalespeople() {
  const [salespeople, setSalespeople] = useState(hardcodedSalespeople);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalespeopleLive().then(data => {
      if (data.length > 0) setSalespeople(data as any);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return { salespeople, loading };
}