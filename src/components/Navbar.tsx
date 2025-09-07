import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { HiHome } from "react-icons/hi";

export default function Navbar() {
   return (
     <nav className="mx-5 my-2 flex items-center justify-between">
       <div>
         <Link href="/"><HiHome className="h-5 w-5"/></Link>
       </div>
       <div className="w-full flex gap-3 justify-end items-center h-12">
         <ThemeSwitcher />
         <LanguageSwitcher />
       </div>
     </nav>
   );
}