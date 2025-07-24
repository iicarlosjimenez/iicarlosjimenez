import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export async function getStaticProps(context: GetStaticPropsContext) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common"])),
    },
  };
}

export default function Home() {

  return (
    <div>
      <Navbar />
      <Hero />
    </div>
  );
}
