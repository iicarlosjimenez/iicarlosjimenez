import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useRouter } from "next/router";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, locales, pathname, query, asPath } = router;

  return (
    <Menu>
      <MenuButton className="px-4 py-2 cursor-pointer rounded-full w-22 hover:scale-105 bg-black text-white dark:bg-white dark:text-black">
        <p>🌐 {locale?.toUpperCase()}</p>
      </MenuButton>
      <MenuItems
        anchor="bottom"
        className="mt-1 px-4 py-2 cursor-pointer rounded-2xl bg-black text-white dark:bg-white dark:text-black"
      >
        {locales?.map((lng) => (
          <MenuItem key={lng}>
            <p
              className="px-2 py-1 w-14"
              onClick={() => {
                router.push({ pathname, query }, asPath, { locale: lng });
              }}
            >
              {lng.toUpperCase()}
            </p>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
