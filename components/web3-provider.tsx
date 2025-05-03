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
  switchNetwork: (chainId: number) => Promise<void>;
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
  switchNetwork: async () => {},
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

  // Contract address from your deployment - likely on the Hardhat local network
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Target chain ID (Hardhat: 31337)
  const targetChainId = 31337;

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
          const currentChainId = Number(network.chainId);
          setChainId(currentChainId);
          setNetworkName(network.name);

          console.log(
            `Connected to network: ${network.name} (${currentChainId})`
          );
        });

        // Listen for account changes
        window.ethereum.on("accountsChanged", handleAccountsChanged);

        // Listen for chain changes
        window.ethereum.on("chainChanged", (newChainId: string) => {
          const parsedChainId = parseInt(newChainId, 16);
          console.log(`Chain changed to: ${parsedChainId}`);
          setChainId(parsedChainId);

          // Refresh the page to ensure everything is in sync
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

          // Get current network
          const network = await provider.getNetwork();
          const currentChainId = Number(network.chainId);
          setChainId(currentChainId);
          setNetworkName(network.name);

          console.log(
            `Connected to network: ${network.name} (${currentChainId})`
          );

          // Only initialize contract if on the correct network
          if (currentChainId === targetChainId) {
            // Initialize contract with the signer
            const crowdFundingContract = new ethers.Contract(
              contractAddress,
              CrowdFunding.abi,
              newSigner
            );

            setContract(crowdFundingContract);
            console.log("Contract initialized on correct network");
          } else {
            console.warn(
              "Connected to wrong network. Contract not initialized."
            );
            setContract(null);
          }
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

  const switchNetwork = async (chainId: number) => {
    if (!window.ethereum) {
      console.error("Ethereum provider not available");
      return;
    }

    const chainIdHex = `0x${chainId.toString(16)}`;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });

      // Network info will be updated via chainChanged event
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        try {
          // For Hardhat local network
          if (chainId === 31337) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: chainIdHex,
                  chainName: "Hardhat Network",
                  nativeCurrency: {
                    name: "Ethereum",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["http://127.0.0.1:8545/"],
                },
              ],
            });
          }
          // Add other networks as needed
        } catch (addError) {
          console.error("Error adding network:", addError);
        }
      } else {
        console.error("Error switching network:", error);
      }
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
        switchNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}
