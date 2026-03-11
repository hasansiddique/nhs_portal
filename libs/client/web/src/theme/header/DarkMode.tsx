import React from 'react';
import { Link } from 'react-router-dom';

import imgsun from '../assets/images/icon/sun.png';

const DarkMode = () => {
  const clickedClass = 'clicked';
  const body = document.body;
  const lightTheme = 'light';
  const darkTheme = 'is_dark';
  let theme: string | null = null;

  if (localStorage) {
    theme = localStorage.getItem('theme');
  }
  if (theme === lightTheme || theme === darkTheme) {
    body.classList.add(theme);
  } else {
    body.classList.add(darkTheme);
  }

  const switchTheme = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const target = e.target as HTMLElement;

    if (theme === darkTheme) {
      body.classList.replace(darkTheme, lightTheme);
      target.classList.remove(clickedClass);
      localStorage.setItem('theme', 'light');
      theme = lightTheme;
    } else {
      body.classList.replace(lightTheme, darkTheme);
      target.classList.add(clickedClass);
      localStorage.setItem('theme', 'is_dark');
      theme = darkTheme;
    }
  };
  return (
    <div className="mode_switcher hidden">
      <Link to="#" onClick={(e) => switchTheme(e)}>
        <img src={imgsun} alt="" />
      </Link>
    </div>
  );
};

export default DarkMode;
