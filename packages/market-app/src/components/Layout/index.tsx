import { Flex } from "@chakra-ui/layout";
import { FC } from "react";

import { Footer } from "../Footer";
import { Header } from "../Header";

export const Layout: FC = ({ children }) => {
  return (
    <Flex direction="column" backgroundColor="#1F1B24">
      <Header />
      <main>{children}</main>
      <Footer />
    </Flex>
  );
};
