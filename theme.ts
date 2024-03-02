import { extendTheme, Theme, ThemeConfig } from '@chakra-ui/react';
// import { ThemeTypings } from '@chakra-ui/styled-system/dist/declarations/src/theme.types';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  cssVarPrefix: 'rm',
};

const primary = '#84922F';
const secondary = '#2F4A59';

const theme: Theme = extendTheme(
  // @ts-ignore
  {
    config,
    colors: {
      rmGreen: primary,
      gray: {
        800: secondary,
      },
      // brand: {
      //   900: '#1a365d',
      //   800: '#153e75',
      //   700: '#2a69ac',
      // },
    },
    fonts: {
      heading: 'Lato, sans-serif',
      body: 'Lato, sans-serif',
      // heading: "'DM Sans', sans-serif",
      // body: "'DM Sans', sans-serif",
    },
  } as Partial<Theme>
) as Theme;
// theme.colors.
export default theme;
