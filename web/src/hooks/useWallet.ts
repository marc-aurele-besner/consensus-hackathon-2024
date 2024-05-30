// file: web/src/hooks/useWallet.ts

"use client";

import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp";
import { useEffect, useState } from "react";
import { networks } from "../constants/networks";
import { Account, Network } from "../types/types";

const useWallet = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0]);
  const [api, setApi] = useState<ApiPromise | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const init = async () => {
        const extensions = await web3Enable("FileOnChain");
        if (extensions.length === 0) {
          return;
        }

        const allAccounts = await web3Accounts();
        setAccounts(allAccounts as Account[]);
      };

      init();
    }
  }, []);

  useEffect(() => {
    const connectApi = async () => {
      if (selectedNetwork) {
        const provider = new WsProvider(selectedNetwork.rpcUrl);
        const api = await ApiPromise.create({ provider });
        setApi(api);
      }
    };

    connectApi();
  }, [selectedNetwork]);

  const connectWallet = async (account: Account) => {
    if (account && api && typeof window !== "undefined") {
      const injector = await web3FromSource(account.meta.source);
      api.setSigner(injector.signer);
      setSelectedAccount(account);
    }
  };

  return {
    accounts,
    selectedAccount,
    selectedNetwork,
    api,
    setSelectedNetwork,
    setSelectedAccount,
    connectWallet,
  };
};

export default useWallet;
