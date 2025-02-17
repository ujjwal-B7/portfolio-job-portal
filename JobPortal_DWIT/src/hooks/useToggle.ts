import { useState, useCallback } from "react";

const useToggle = (): [boolean, () => void, () => void] => {
  const [state, setState] = useState<boolean>(false);

  const toggle = useCallback(() => {
    setState((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setState(false);
  }, []);

  return [state, toggle, close];
};

export default useToggle;
