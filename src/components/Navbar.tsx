import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
   return (
     <nav className="mx-3 my-2 flex items-center justify-between">
       <div className="w-full flex gap-3 justify-end items-center h-12">
         <ThemeSwitcher />
         <LanguageSwitcher />
       </div>
     </nav>
   );
}