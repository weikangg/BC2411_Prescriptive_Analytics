import { useColorScheme } from 'react-native';

export const lightTheme = {
  background: '#fff',
  text: '#000',
  buttonBackground: 'rgba(22, 143, 85, 1)',
};

export const darkTheme = {
  background: '#000', // Choose an appropriate dark background
  text: '#fff',
  buttonBackground: 'rgba(22, 143, 85, 1)', // or adjust as needed
};

export function useThemeColors() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}
