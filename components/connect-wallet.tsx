"use client";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/lib/hooks/use-web3";
import { Loader2 } from "lucide-react";

export default function ConnectWallet() {
  const { connect, disconnect, isConnected, address, isConnecting } = useWeb3();

  if (isConnected && address) {
    // Ensure address is a string before slicing
    const displayAddress =
      typeof address === "string"
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "Connected";

    return (
      <Button variant="outline" onClick={disconnect}>
        {displayAddress}
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={connect} disabled={isConnecting}>
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
}
