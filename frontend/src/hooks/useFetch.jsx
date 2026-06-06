import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { tmdbInstance } from "../api/axios.js";

function useFetch(url, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled && url));
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const refetch = useCallback(() => {
    setRetryKey(key => key + 1);
  }, [])

  useEffect(() => {
    if (!enabled || !url) return;

    const controller = new AbortController();

    async function getData() {
      setLoading(true);
      setError(null);

      try {
        const response = await tmdbInstance.get(url, {
          signal: controller.signal,
        });

        setData(response.data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getData();

    return () => controller.abort();
  }, [url, enabled, retryKey]);

  return { data, loading, error, refetch };
}

export default useFetch;
