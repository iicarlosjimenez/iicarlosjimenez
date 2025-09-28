import Main from "@/components/Main";
import Navbar from "@/components/Navbar";
import { GetStaticPropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import BuyMeBeer from "@/components/BuyMeBeer";
import Head from "next/head";

export async function getStaticProps(context: GetStaticPropsContext) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common"])),
    },
  };
}

export default function BuyMeABeer() {

  return (
    <div>
      <Head>
        <title>Carlos Jiménez - Buy me a beer</title>
      </Head>
      <Navbar />
      <Main>
        <BuyMeBeer />
      </Main>
    </div>
  );
}
