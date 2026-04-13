import { useEffect, useState } from "react";

export const useHasScrolled = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "scroll",
      () => {
        setHasScrolled(window.scrollY > 0);
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  }, []);

  return hasScrolled;
};
