import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const DarkModeSwitch = () => {
  const moonIcon = <MoonIcon className="h-6 w-6 text-slate-500" />;
  const sunIcon = <SunIcon className="h-6 w-6 dark:text-slate-400" />;

  const [themeIcon, setThemeIcon] = useState(
    localStorage.theme === "light" ? moonIcon : sunIcon
  );

  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light";
  }

  function handleClick() {
    if (!localStorage.theme) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        localStorage.theme = "dark";
      } else localStorage.theme = "light";
    } else if (localStorage.theme === "dark") {
      localStorage.theme = "light";
      setThemeIcon(moonIcon);
    } else {
      localStorage.theme = "dark";
      setThemeIcon(sunIcon);
    }
  }

  return (
    <button className="dark:text-slate-400" onClick={handleClick}>
      {themeIcon}
    </button>
  );
};

export default DarkModeSwitch;
