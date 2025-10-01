import { Trans, useTranslation } from "next-i18next";
import Link from "next/link";
import Main from "./Main";

export default function Hero() {
  const { t } = useTranslation("common");

  return (
    <Main>
      <h1 className="select-none text-4xl font-bold">{t("hero.title")}</h1>
      <p className="select-none mt-4">{t("hero.description")}</p>

      <Link
        href="/buymeabeer"
        className="select-none px-6 py-4 cursor-pointer rounded-full hover:scale-105 bg-black text-white dark:bg-white dark:text-black"
      >
        <p className="text-xl font-bold">
          <Trans
            i18nKey="buymeabeer.buy-me-a-beer"
            components={{ del: <del /> }}
          />
          <span>🍻</span>
        </p>
      </Link>
    </Main>
  );
}
