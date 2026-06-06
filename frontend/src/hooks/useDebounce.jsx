import { useEffect, useState } from "react";

export default function useDebounce(query, delay = 500) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
      setTyping(false);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [delay, query]);

  return { debouncedQuery, typing, setTyping };
}