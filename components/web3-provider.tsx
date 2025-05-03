"use client";

import type React from "react";
import { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import CrowdFunding from "@/contracts/CrowdFunding.json";

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: ethers.Contract | null;
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  chainId: number | null;
  networkName: string | null;
}

export const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  contract: null,
  address: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  chainId: null,
  networkName: null,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);

  // Contract address from your deployment
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Initialize provider
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const ethereumProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(ethereumProvider);

        // Check if already connected
        ethereumProvider.listAccounts().then((accounts) => {
          if (accounts.length > 0) {
            handleAccountsChanged(accounts);
          }
        });

        // Get network information
        ethereumProvider.getNetwork().then((network) => {
          setChainId(Number(network.chainId));
          setNetworkName(network.name);
        });

        // Listen for account changes
        window.ethereum.on("accountsChanged", handleAccountsChanged);

        // Listen for chain changes
        window.ethereum.on("chainChanged", (_chainId: string) => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error initializing provider:", error);
      }
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts: any) => {
    if (accounts.length === 0) {
      // User disconnected
      setAddress(null);
      setSigner(null);
      setContract(null);
      setIsConnected(false);
    } else {
      // User connected or switched accounts
      try {
        if (provider) {
          const newSigner = await provider.getSigner();
          const connectedAddress = await newSigner.getAddress();

          setSigner(newSigner);
          setAddress(connectedAddress);
          setIsConnected(true);

          console.log("Connected account:", connectedAddress);

          // Initialize contract with the signer
          const crowdFundingContract = new ethers.Contract(
            contractAddress,
            CrowdFunding.abi,
            newSigner
          );

          setContract(crowdFundingContract);
          console.log("Contract initialized");
        }
      } catch (error) {
        console.error("Error setting up web3:", error);
      }
    }
  };

  const connect = async () => {
    if (!provider) {
      console.error("Provider not initialized");
      return;
    }

    setIsConnecting(true);
    try {
      console.log("Requesting accounts...");
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await provider.listAccounts();
      console.log("Accounts received:", accounts);

      if (accounts.length > 0) {
        await handleAccountsChanged(accounts);
      } else {
        console.error("No accounts received after connection");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setSigner(null);
    setContract(null);
    setIsConnected(false);
  };

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        contract,
        address,
        isConnected,
        isConnecting,
        connect,
        disconnect,
        chainId,
        networkName,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}
