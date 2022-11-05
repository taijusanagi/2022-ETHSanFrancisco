import { Container, Stack } from "@chakra-ui/layout";
import { FC } from "react";

import { Header } from "../Header";

export const Layout: FC = ({ children }) => {
  return (
    <Stack>
      <Header />

      <main>
        <Container maxW="2xl" py="4">
          {children}
        </Container>
      </main>
    </Stack>
  );
};
