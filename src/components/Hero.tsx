import { useTranslation } from "next-i18next";

export default function Hero() {
  const { t } = useTranslation("common");

  return (
    <main className="min-h-[88vh] flex flex-col gap-4 mx-2 text-center  items-center justify-center">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="mt-4">{t("description")}</p>
    </main>
  );
}
