import { Button, Stack, Text } from "@chakra-ui/react";
import { VerificationResponse, WidgetProps } from "@worldcoin/id";
import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { useContract } from "../../hooks/useContract";
import { Layout } from "../components/Layout";
import { verificationType } from "../lib/contract";

const WorldIDWidget = dynamic<WidgetProps>(() => import("@worldcoin/id").then((mod) => mod.WorldIDWidget), {
  ssr: false,
});

export interface HomeProps {
  worldId: boolean;
}

const Home: NextPage<HomeProps> = ({ worldId }) => {
  const { contract } = useContract();
  const { address } = useAccount();

  const [worldIdVerificationResponse, setWorldIdVerificationResponse] = useState<VerificationResponse>();
  const [isWorldIdVerified, setIsWorldIdVerified] = useState(false);

  const register = async () => {
    if (!contract || !address || !worldIdVerificationResponse) {
      return;
    }
    try {
      const data = await contract.encodeWorldIdProof(
        address,
        worldIdVerificationResponse.merkle_root,
        worldIdVerificationResponse.nullifier_hash,
        worldIdVerificationResponse.proof
      );
      await contract.verify(verificationType.worldId, data);
      setIsWorldIdVerified(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!contract || !address) {
      return;
    }

    contract
      .isVerified(verificationType.worldId, address)
      .then((isWorldIdVerified) => setIsWorldIdVerified(isWorldIdVerified));
  }, [contract, address]);

  return (
    <Layout>
      <Stack spacing="8">
        <Stack spacing="2">
          <Text fontSize="3xl" fontWeight={"bold"}>
            Chiro Protect Verifier
          </Text>
          <Text fontSize="md">Please verify with the following ID to get access to the collection</Text>
        </Stack>

        {worldId && (
          <Stack>
            <Text size="sm" fontWeight={"bold"}>
              WorldID
            </Text>
            <Text size="xs">Please verify you are a real person</Text>
            {address && (
              <>
                {!isWorldIdVerified && (
                  <>
                    {!worldIdVerificationResponse && (
                      <WorldIDWidget
                        actionId="wid_staging_17c2f1a21976f1848a55ff7fdde682a0"
                        signal={address}
                        enableTelemetry
                        onSuccess={setWorldIdVerificationResponse}
                        onError={(error) => console.error(error)}
                        debug={true}
                      />
                    )}
                    {worldIdVerificationResponse && (
                      <Button onClick={register} disabled={!worldIdVerificationResponse}>
                        Register
                      </Button>
                    )}
                  </>
                )}
                {isWorldIdVerified && {}}
              </>
            )}
          </Stack>
        )}
      </Stack>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { ipfsHash } = context.query;
  const data = { worldId: true };
  // TODO: implement
  console.log("fetch data from", ipfsHash, data);

  return {
    props: data,
  };
};
