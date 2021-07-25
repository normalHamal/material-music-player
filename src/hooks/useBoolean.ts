import { useState } from 'react';

export interface Actions {
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
  state: boolean;
}

export default (defaultValue = false): Actions => {
  const [state, setBool] = useState(defaultValue);

  const setTrue = () => setBool(true);
  const setFalse = () => setBool(false);
  const toggle = () => setBool((s) => !s);

  return { state, setTrue, setFalse, toggle };
};
