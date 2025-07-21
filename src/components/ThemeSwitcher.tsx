import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HiMoon, HiSun } from "react-icons/hi";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="px-4 py-2 cursor-pointer hover:border rounded"
      onClick={() => {
        if (theme == "dark") setTheme("light");
        else setTheme("dark");
      }}
    >
      {isDark ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
    </div>
  );
}
