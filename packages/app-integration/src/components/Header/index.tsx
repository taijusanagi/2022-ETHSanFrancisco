/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Link,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { InformationCircleIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NextLink from "next/link";
import { SocialIcon } from "react-social-icons";

import { NavDrawerItem, NavItem } from "./NavItem";

export const Header = () => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  const name = "vMarket";

  const navItems = [
    {
      text: "buy",
      href: "/",
    },
    {
      text: "sell",
      href: "/mypage",
      icon: <InformationCircleIcon className="h-6 w-6" />,
    },
  ];

  return (
    <header>
      <Flex justify={"right"} p={4}>
        <ConnectButton accountStatus={"address"} />
      </Flex>
    </header>
  );
};
