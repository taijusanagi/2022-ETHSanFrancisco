import { Flex } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
  return (
    <header>
      <Flex justify={"right"} p={4}>
        <ConnectButton accountStatus={"address"} />
      </Flex>
    </header>
  );
};
