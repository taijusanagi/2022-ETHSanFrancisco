import { Flex } from "@chakra-ui/layout";
import Head from "next/head";
import { FC } from "react";

import { Header } from "../Header";

export const Layout: FC = ({ children }) => {
  return (
    <>
      <Head>
        <title>ilyxium</title>
        <meta name="description" content="Ethereum + Next.js DApp Boilerplate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex direction="column" backgroundColor="#1F1B24">
        <Header />
        <main>{children}</main>
        <Footer />
      </Flex>
    </>
  );
};

const Footer = () => {
  return <Flex height="10%"></Flex>;
};
