"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWeb3 } from "@/lib/hooks/use-web3"
import type { Campaign } from "@/lib/types"
import Link from "next/link"
import { formatEther } from "ethers"
import { Loader2 } from "lucide-react"
import CampaignCard from "@/components/campaign-card"

export default function DashboardPage() {
  const { contract, address, isConnected } = useWeb3()
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([])
  const [myDonations, setMyDonations] = useState<
    {
      campaign: Campaign
      amount: string
    }[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (contract && address) {
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [contract, address])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const allCampaigns = await contract.getCampaigns()

      // Filter campaigns created by the user
      const userCampaigns = allCampaigns
        .filter((campaign: any) => campaign.owner.toLowerCase() === address.toLowerCase())
        .map((campaign: any) => ({
          id: campaign.id.toString(),
          owner: campaign.owner,
          title: campaign.title,
          description: campaign.description,
          target: campaign.target,
          deadline: new Date(Number(campaign.deadline) * 1000),
          amountCollected: campaign.amountCollected,
          image: campaign.image,
          donators: campaign.donators || [],
          donations: campaign.donations?.map((d: any) => formatEther(d)) || [],
          category: campaign.category,
          createdAt: new Date(Number(campaign.createdAt) * 1000),
        }))

      setMyCampaigns(userCampaigns)

      // Find campaigns the user has donated to
      const userDonations = allCampaigns
        .filter(
          (campaign: any) =>
            campaign.donators &&
            campaign.donators.some((donator: string) => donator.toLowerCase() === address.toLowerCase()),
        )
        .map((campaign: any) => {
          const donationIndices = campaign.donators
            .map((donator: string, index: number) => (donator.toLowerCase() === address.toLowerCase() ? index : -1))
            .filter((index: number) => index !== -1)

          const totalDonation = donationIndices.reduce(
            (sum: bigint, index: number) => sum + campaign.donations[index],
            BigInt(0),
          )

          return {
            campaign: {
              id: campaign.id.toString(),
              owner: campaign.owner,
              title: campaign.title,
              description: campaign.description,
              target: campaign.target,
              deadline: new Date(Number(campaign.deadline) * 1000),
              amountCollected: campaign.amountCollected,
              image: campaign.image,
              donators: campaign.donators || [],
              donations: campaign.donations?.map((d: any) => formatEther(d)) || [],
              category: campaign.category,
              createdAt: new Date(Number(campaign.createdAt) * 1000),
            },
            amount: formatEther(totalDonation),
          }
        })

      setMyDonations(userDonations)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-muted-foreground mb-6">You need to connect your wallet to view your dashboard.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-4">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your campaigns and track your contributions</p>
        </div>
        <Button asChild>
          <Link href="/campaigns/create">Create Campaign</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myCampaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Campaigns Supported</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myDonations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contributed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Ξ {myDonations.reduce((sum, donation) => sum + Number(donation.amount), 0).toFixed(4)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="my-campaigns" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-campaigns">My Campaigns</TabsTrigger>
          <TabsTrigger value="my-contributions">My Contributions</TabsTrigger>
        </TabsList>
        <TabsContent value="my-campaigns" className="mt-6">
          {myCampaigns.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <h3 className="text-xl font-medium mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-6">You haven't created any campaigns yet.</p>
              <Button asChild>
                <Link href="/campaigns/create">Create Campaign</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="my-contributions" className="mt-6">
          {myDonations.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <h3 className="text-xl font-medium mb-2">No contributions yet</h3>
              <p className="text-muted-foreground mb-6">You haven't contributed to any campaigns yet.</p>
              <Button asChild>
                <Link href="/campaigns">Browse Campaigns</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myDonations.map((donation, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="p-6">
                    <Link
                      href={`/campaigns/${donation.campaign.id}`}
                      className="text-lg font-semibold hover:underline line-clamp-1"
                    >
                      {donation.campaign.title}
                    </Link>
                    <p className="text-sm text-muted-foreground mb-4">
                      by {donation.campaign.owner.slice(0, 6)}...{donation.campaign.owner.slice(-4)}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Your contribution</p>
                        <p className="text-xl font-bold">Ξ {donation.amount}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/campaigns/${donation.campaign.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
