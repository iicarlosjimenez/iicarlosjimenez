"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HiMoon, HiSun } from "react-icons/hi";

export default function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`flex px-4 py-2 cursor-pointer rounded-full hover:scale-105 bg-black text-white dark:bg-white dark:text-black`}
      onClick={toggleTheme}
    >
      {isDark ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
    </div>
  );
}
