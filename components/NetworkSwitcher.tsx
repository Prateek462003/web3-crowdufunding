"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/lib/hooks/use-web3";
import { Loader2 } from "lucide-react";

export default function NetworkSwitcher() {
  const { provider, chainId, isConnected } = useWeb3();
  const [isChangingNetwork, setIsChangingNetwork] = useState(false);
  const [networkError, setNetworkError] = useState("");

  // Hardhat network chain ID is 31337
  const targetChainId = 31337;
  const targetNetwork = {
    chainId: `0x${targetChainId.toString(16)}`, // Convert to hex string
    chainName: "Hardhat Network",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["http://127.0.0.1:8545/"],
  };

  // Check if on the right network
  const isCorrectNetwork = chainId === targetChainId;

  const switchNetwork = async () => {
    if (!window.ethereum || !provider) {
      setNetworkError("MetaMask is not installed or not accessible");
      return;
    }

    setIsChangingNetwork(true);
    setNetworkError("");

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetNetwork.chainId }],
      });
    } catch (switchError) {
      // This error code means the chain hasn't been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [targetNetwork],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
          setNetworkError(`Failed to add network: ${addError.message}`);
        }
      } else {
        console.error("Error switching network:", switchError);
        setNetworkError(`Failed to switch network: ${switchError.message}`);
      }
    } finally {
      setIsChangingNetwork(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="mb-6">
      {!isCorrectNetwork && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium">Wrong network detected</p>
            <p className="text-sm">
              Please switch to Hardhat Network to interact with this dApp
            </p>
            {networkError && (
              <p className="text-red-600 text-sm mt-1">{networkError}</p>
            )}
          </div>
          <Button
            onClick={switchNetwork}
            disabled={isChangingNetwork}
            variant="outline"
            className="whitespace-nowrap"
          >
            {isChangingNetwork ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Switching...
              </>
            ) : (
              "Switch Network"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
