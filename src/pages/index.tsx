
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { GetStaticPropsContext } from "next";


export async function getStaticProps(context: GetStaticPropsContext) {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common"])),
    },
  };
}

export default function Home() {
  const { t } = useTranslation("common");

  return (
    <div>
      <nav className="mx-3 my-2 flex items-center justify-between">
        <></>
        <div className="w-full flex gap-3 justify-end items-center h-12">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </nav>
      <main className="min-h-screen flex flex-col mx-2 text-center  items-center justify-center">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="mt-4">{t("description")}</p>
      </main>
      <footer></footer>
    </div>
  );
}
