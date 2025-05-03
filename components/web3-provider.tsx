"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { ethers } from "ethers"
import CrowdFunding from "@/contracts/CrowdFunding.json"

interface Web3ContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  contract: ethers.Contract | null
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
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
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  // Contract address would come from your deployment
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  useEffect(() => {
    // Check if window is defined (browser environment)
    if (typeof window !== "undefined" && window.ethereum) {
      const ethereumProvider = new ethers.BrowserProvider(window.ethereum)
      setProvider(ethereumProvider)

      // Check if already connected
      ethereumProvider.listAccounts().then((accounts) => {
        if (accounts.length > 0) {
          handleAccountsChanged(accounts)
        }
      })

      // Listen for account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  const handleAccountsChanged = async (accounts: any) => {
    if (accounts.length === 0) {
      // User disconnected
      setAddress(null)
      setSigner(null)
      setContract(null)
      setIsConnected(false)
    } else {
      // User connected or switched accounts
      try {
        if (provider) {
          const newSigner = await provider.getSigner()
          setSigner(newSigner)
          setAddress(accounts[0])
          setIsConnected(true)

          // Initialize contract
          const crowdFundingContract = new ethers.Contract(contractAddress, CrowdFunding.abi, newSigner)
          setContract(crowdFundingContract)
        }
      } catch (error) {
        console.error("Error setting up web3:", error)
      }
    }
  }

  const connect = async () => {
    if (!provider) return

    setIsConnecting(true)
    try {
      await provider.send("eth_requestAccounts", [])
      const accounts = await provider.listAccounts()
      handleAccountsChanged(accounts)
    } catch (error) {
      console.error("Error connecting to wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setSigner(null)
    setContract(null)
    setIsConnected(false)
  }

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
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
