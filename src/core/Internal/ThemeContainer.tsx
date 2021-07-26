import React, { useState, useMemo, useEffect } from 'react';
import {
  useMediaQuery,
  PaletteType,
  createTheme,
  ThemeProvider,
} from '@material-ui/core';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import { DefaultTheme } from '../constants';

export default (props: ThemeProviderProps) => {
  const { children, themeOptions = {}, themeType = 'auto' } = props;
  // 检测当前用户的操作系统是否为深色主题
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [type, setThemeType] = useState<PaletteType>(
    prefersDarkMode ? 'dark' : 'light',
  );

  const theme = useMemo(() => {
    const mergeThemeOptions = {
      ...DefaultTheme,
      ...themeOptions,
    };

    return createTheme({
      palette: {
        type,
        ...mergeThemeOptions[type],
      },
    });
  }, [themeOptions, type]);

  useEffect(() => {
    if (themeType === 'auto') {
      setThemeType(prefersDarkMode ? 'dark' : 'light');
    } else {
      setThemeType(themeType);
    }
  }, [prefersDarkMode, themeType]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export interface ThemeOptions {
  light?: PaletteOptions;
  dark?: PaletteOptions;
}

export type ThemeType = 'auto' | 'light' | 'dark';

interface ThemeProviderProps {
  children?: React.ReactNode;
  themeOptions?: ThemeOptions;
  themeType?: ThemeType;
}
