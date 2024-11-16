import { useState } from 'react';
import useStore from '../store';

function ThemeSwitch() {
  // eslint-disable-next-line no-undef
  const { setTheme, theme } = useStore((state) => state);
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');

  const tooggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  return (
    <div
      className={`switch ${isDarkMode ? 'light' : 'dark'}`}
      onClick={tooggleTheme}
    >
      <div className={`ball ${isDarkMode ? 'dark' : 'light'}`}></div>
    </div>
  );
}

export default ThemeSwitch;
