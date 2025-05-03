"use server"

import type { Campaign } from "./types"

// This is a mock function that would normally interact with your contract
// In a real app, you would use ethers.js to call your contract functions
export async function getCampaigns(): Promise<Campaign[]> {
  // Mock data for demonstration
  return [
    {
      id: "1",
      owner: "0x1234567890123456789012345678901234567890",
      title: "Decentralized Education Platform",
      description: "Building a platform to make education accessible to everyone through blockchain technology.",
      target: BigInt("5000000000000000000"), // 5 ETH
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      amountCollected: BigInt("2500000000000000000"), // 2.5 ETH
      image: "/placeholder.svg?height=200&width=400",
      donators: ["0xabcdef1234567890abcdef1234567890abcdef12", "0x9876543210abcdef9876543210abcdef98765432"],
      donations: ["1.5", "1.0"],
      category: "tech",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
    {
      id: "2",
      owner: "0xabcdef1234567890abcdef1234567890abcdef12",
      title: "NFT Art Collection for Charity",
      description: "Creating a collection of NFT art with proceeds going to environmental conservation.",
      target: BigInt("3000000000000000000"), // 3 ETH
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      amountCollected: BigInt("1800000000000000000"), // 1.8 ETH
      image: "/placeholder.svg?height=200&width=400",
      donators: [
        "0x1234567890123456789012345678901234567890",
        "0x9876543210abcdef9876543210abcdef98765432",
        "0x5678901234abcdef5678901234abcdef56789012",
      ],
      donations: ["0.5", "0.8", "0.5"],
      category: "art",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      id: "3",
      owner: "0x9876543210abcdef9876543210abcdef98765432",
      title: "Community-Owned DeFi Protocol",
      description: "Developing a DeFi protocol that is fully owned and governed by its community of users.",
      target: BigInt("10000000000000000000"), // 10 ETH
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      amountCollected: BigInt("3500000000000000000"), // 3.5 ETH
      image: "/placeholder.svg?height=200&width=400",
      donators: [
        "0x1234567890123456789012345678901234567890",
        "0xabcdef1234567890abcdef1234567890abcdef12",
        "0x5678901234abcdef5678901234abcdef56789012",
        "0xfedcba9876543210fedcba9876543210fedcba98",
      ],
      donations: ["1.0", "1.0", "0.5", "1.0"],
      category: "defi",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    },
  ]
}
