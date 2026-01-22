'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiResult<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
}

/**
 * Custom hook for making GET requests with automatic loading/error states
 */
export function useApi<T>(endpoint: string, immediate = true): UseApiResult<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  useEffect(() => {
    if (!immediate) return;

    let cancelled = false;

    // Async function to fetch data
    (async () => {
      try {
        const data = await api.get<T>(endpoint);
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ data: null, loading: false, error: error as Error });
        }
      }
    })();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      cancelled = true;
    };
  }, [endpoint, immediate]);

  const refetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await api.get<T>(endpoint);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [endpoint]);

  return {
    ...state,
    refetch,
  };
}

/**
 * Custom hook for making POST/PUT/PATCH/DELETE requests
 */
export function useMutation<TData, TResponse>(
  method: 'post' | 'put' | 'patch' | 'delete',
  endpoint: string
) {
  const [state, setState] = useState<UseApiState<TResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (data?: TData): Promise<TResponse | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      let response: TResponse;
      if (method === 'delete') {
        response = await api.delete<TResponse>(endpoint);
      } else {
        response = await api[method]<TResponse>(endpoint, data);
      }
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
      return null;
    }
  }, [method, endpoint]);

  return {
    ...state,
    mutate: mutate,
  };
}

export default useApi;

