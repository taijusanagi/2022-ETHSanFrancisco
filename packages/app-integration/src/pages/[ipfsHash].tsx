import { Button, Stack, Text } from "@chakra-ui/react";
import { VerificationResponse, WidgetProps } from "@worldcoin/id";
import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { QRCode } from "react-qr-svg";
import { useAccount } from "wagmi";

import depolyments from "../../../contracts/deployments.json";
import { useContract } from "../../hooks/useContract";
import { Layout } from "../components/Layout";
import { verificationType } from "../lib/contract";
import { proofRequest } from "../lib/polygonId";

// modification of polygon id request

const WorldIDWidget = dynamic<WidgetProps>(() => import("@worldcoin/id").then((mod) => mod.WorldIDWidget), {
  ssr: false,
});

export interface HomeProps {
  worldId?: boolean;
  polygonId?: { req: any; schema: any };
}

const Home: NextPage<HomeProps> = ({ worldId, polygonId }) => {
  const { contract } = useContract();
  const { address } = useAccount();

  const [worldIdVerificationResponse, setWorldIdVerificationResponse] = useState<VerificationResponse>();
  const [isWorldIdVerified, setIsWorldIdVerified] = useState(false);
  const [isPolygonIdVerified, setIsPolygonIdVerified] = useState(false);

  const polygonIdQR = useMemo(() => {
    if (!polygonId) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qrProofRequestJson = { ...proofRequest } as any;
    qrProofRequestJson.body.transaction_data.contract_address = depolyments.verificationResistory;
    qrProofRequestJson.body.scope[0].rules.query.req = polygonId.req;
    qrProofRequestJson.body.scope[0].rules.query.schema = polygonId.schema;
    return qrProofRequestJson;
  }, [polygonId]);

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

    contract
      .isVerified(verificationType.polygonId, address)
      .then((isPolygonIdVerified) => setIsPolygonIdVerified(isPolygonIdVerified));
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
            <Text fontSize="lg" fontWeight={"bold"}>
              World ID
            </Text>
            <Text fontSize="md">Please verify you are a unique person</Text>
            {address && contract && (
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
                {isWorldIdVerified && (
                  <Text fontSize="sm" fontWeight={"bold"}>
                    Verified
                  </Text>
                )}
              </>
            )}
          </Stack>
        )}
        {polygonId && polygonIdQR && (
          <Stack>
            <Text fontSize="lg" fontWeight={"bold"}>
              Polygon ID
            </Text>
            <Text fontSize="md">Please verify with the following credential</Text>
            <Text fontSize="sm">
              {polygonId.schema.type} - {Object.keys(polygonId.req)[0]}
            </Text>
            {!isPolygonIdVerified && <QRCode level="Q" style={{ width: 256 }} value={JSON.stringify(polygonIdQR)} />}
            {isPolygonIdVerified && (
              <Text fontSize="sm" fontWeight={"bold"}>
                Verified
              </Text>
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

  // this is set here from ipfs hash because this should accept dynamic setting from the dashboard
  const data = {
    worldId: true,
    polygonId: {
      req: {
        isCommunityMember: {
          $eq: 1,
        },
      },
      schema: {
        url: "https://s3.eu-west-1.amazonaws.com/polygonid-schemas/47464137-49e5-4e87-a877-89107de70e36.json-ld",
        type: "ChiroProtect",
      },
    },
  };
  // TODO: implement
  console.log("fetch data from", ipfsHash, data);
  return {
    props: data,
  };
};
