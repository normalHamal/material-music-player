import React, { useState, useMemo, useEffect } from 'react';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { useMediaQuery, PaletteType } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';

export default (props: ThemeProviderProps) => {
  const { children, themeOptions = {} } = props;
  // 检测当前用户的操作系统是否为深色主题
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeType, setThemeType] = useState<PaletteType>(
    prefersDarkMode ? 'dark' : 'light',
  );

  const theme = useMemo(() => {
    const mergeThemeOptions = {
      light: {
        primary: {
          light: '#51b7ae',
          main: '#26a69a',
          dark: '#1a746b',
          contrastText: '#FFF',
        },
        secondary: pink,
      },
      dark: {
        primary: {
          light: '#414141',
          main: '#757575',
          dark: '#0c0c0c',
          contrastText: '#FFF',
        },
        secondary: {
          light: '#dd33fa',
          main: '#d500f9',
          dark: '#9500ae',
          contrastText: '#212121',
        },
      },
      ...themeOptions,
    };

    return createTheme({
      palette: {
        type: themeType,
        ...mergeThemeOptions[themeType],
      },
    });
  }, [themeType]);

  useEffect(() => {
    setThemeType(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export interface ThemeOptions {
  light?: PaletteOptions;
  dark?: PaletteOptions;
}

interface ThemeProviderProps {
  children?: React.ReactNode;
  themeOptions?: ThemeOptions;
}
