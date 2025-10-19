import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Head from "next/head";

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
      <Head>
        <title>Carlos Jiménez</title>
        <meta name="keywords" content="desarrollo a la medida, iicarlosjim, iicarlosjimenez, ii carlos jimenez, carlos jimenez" />
      </Head>
      <Navbar />
      <Hero />
    </div>
  );
}
