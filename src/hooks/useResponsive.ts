import React, { useEffect, useState } from 'react';

interface IResponsiveParams {
  offsetWidth?: number;
  offsetHeight?: number;
}

export default (params: IResponsiveParams) => {
  const { offsetWidth = 0, offsetHeight = 0 } = params;
  const [visualWidth, setWidth] = useState(0);
  const [visualHeight, setHeight] = useState(0);

  const calculate = () => {
    const innerWidth =
      window.innerWidth ||
      document.body.clientWidth ||
      document.documentElement.clientWidth;
    const innerHeight =
      window.innerHeight ||
      document.body.clientHeight ||
      document.documentElement.clientHeight;

    setWidth(innerWidth - offsetWidth);
    setHeight(innerHeight - offsetHeight);
  };

  useEffect(() => {
    const handleResize = () => calculate();
    setTimeout(handleResize, 0);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { visualWidth, visualHeight };
};
