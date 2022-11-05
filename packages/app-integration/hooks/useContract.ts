import { useEffect, useState } from "react";
import { useSigner } from "wagmi";

import { Contract } from "../src/lib/contract";

export const useContract = () => {
  const { data: signer } = useSigner();

  const [contract, setContract] = useState<Contract>();
  useEffect(() => {
    if (!signer) {
      return;
    }
    const contract = new Contract(signer);
    setContract(contract);
  }, [signer]);

  return { contract };
};
