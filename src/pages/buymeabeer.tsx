import Main from "@/components/Main";
import Navbar from "@/components/Navbar";
import { GetStaticPropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Checkout from "@/components/Checkout";
import Head from "next/head";
import Stripe from "stripe"
import { useEffect, useState } from "react";

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
        <Checkout />
      </Main>
    </div>
  );
}
