import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { VerificationResponse, WidgetProps } from "@worldcoin/id";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useAccount } from "wagmi";

import { useContract } from "../../hooks/useContract";
import { Layout } from "../components/Layout";

const WorldIDWidget = dynamic<WidgetProps>(() => import("@worldcoin/id").then((mod) => mod.WorldIDWidget), {
  ssr: false,
});

const Home: NextPage = () => {
  const { contract } = useContract();
  const { address } = useAccount();

  const [verificationResponse, setVerificationResponse] = useState<VerificationResponse>();

  const register = async () => {
    if (!contract || !address || !verificationResponse) {
      return;
    }
    const data = await contract.encodeWorldIdProof(
      address,
      verificationResponse.merkle_root,
      verificationResponse.nullifier_hash,
      verificationResponse.proof
    );
    await contract.verify("1", data);
  };

  return (
    <Layout>
      <Stack spacing="4">
        <Text size="xl" fontWeight={"bold"}>
          Worldcoin integration
        </Text>
        {contract && address && (
          <Box>
            {!verificationResponse && (
              <WorldIDWidget
                actionId="wid_staging_17c2f1a21976f1848a55ff7fdde682a0"
                signal={address}
                enableTelemetry
                onSuccess={(verificationResponse) => setVerificationResponse(verificationResponse)}
                onError={(error) => console.error(error)}
                debug={true}
              />
            )}
            {verificationResponse && (
              <Button onClick={register} disabled={!verificationResponse}>
                Register
              </Button>
            )}
          </Box>
        )}
      </Stack>
    </Layout>
  );
};

export default Home;
