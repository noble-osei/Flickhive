import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const scrollPositions = new Map();

export default function ScrollManager() {
  const routerLocation = useLocation();
  const navigationType = useNavigationType();
  const activeLocationKey = useRef(routerLocation.key);

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";

    const currentKey = routerLocation.key;
    activeLocationKey.current = currentKey;

    if (navigationType === "POP") {
      const savedPosition = scrollPositions.get(currentKey) ?? 0;

      window.scrollTo({
        top: savedPosition,
        left: 0,
        behavior: "auto",
      });

      const timerId = window.setTimeout(() => {
        window.scrollTo({
          top: savedPosition,
          left: 0,
          behavior: "auto",
        });
      }, 100);

      return () => window.clearTimeout(timerId);
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [routerLocation.key, navigationType]);

  useLayoutEffect(() => {
    const savePosition = () => {
      scrollPositions.set(activeLocationKey.current, window.scrollY);
    };

    window.addEventListener("scroll", savePosition, {
      passive: true,
    });

    return () => {
      savePosition();
      window.removeEventListener("scroll", savePosition);
    };
  }, []);

  return null;
}