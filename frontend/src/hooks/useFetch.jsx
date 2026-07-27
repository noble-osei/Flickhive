import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { tmdbInstance } from "../api/axios.js";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

const cache = new Map(); // url -> { data, timestamp }
const inFlight = new Map(); // url -> { promise, controller, refCount }

function isFresh(entry) {
  return Boolean(entry) && Date.now() - entry.timestamp < STALE_TIME;
}

function startFetch(url) {
  const controller = new AbortController();

  const promise = tmdbInstance
    .get(url, { signal: controller.signal })
    .then((response) => {
      cache.set(url, { data: response.data, timestamp: Date.now() });
      return response.data;
    })
    .finally(() => {
      inFlight.delete(url);
    });

  const entry = { promise, controller, refCount: 0 };
  inFlight.set(url, entry);
  return entry;
}

function useFetch(url, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled && url));
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const refetch = useCallback(() => {
    if (url) cache.delete(url);
    setRetryKey((key) => key + 1);
  }, [url]);

  useEffect(() => {
    if (!enabled || !url) return;
    // A fresh cache hit needs no fetch — the return statement below derives
    // the displayed value straight from `cache` so there's nothing to sync.
    if (isFresh(cache.get(url))) return;

    let cancelled = false;
    const entry = inFlight.get(url) ?? startFetch(url);
    entry.refCount += 1;

    async function getData() {
      setLoading(true);
      setError(null);

      try {
        const responseData = await entry.promise;
        if (!cancelled) setData(responseData);
      } catch (err) {
        if (!cancelled && !axios.isCancel(err)) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    getData();

    return () => {
      cancelled = true;
      entry.refCount -= 1;
      if (entry.refCount <= 0) {
        entry.controller.abort();
        inFlight.delete(url);
      }
    };
  }, [url, enabled, retryKey]);

  const cached = enabled && url ? cache.get(url) : undefined;
  const cacheFresh = isFresh(cached);

  return {
    data: cacheFresh ? cached.data : data,
    loading: cacheFresh ? false : loading,
    error: cacheFresh ? null : error,
    refetch,
  };
}

export default useFetch;
