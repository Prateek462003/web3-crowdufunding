"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWeb3 } from "@/lib/hooks/use-web3"
import type { Campaign } from "@/lib/types"
import { formatDistanceToNow, format } from "date-fns"
import { formatEther, parseEther } from "ethers"
import { Loader2 } from "lucide-react"

export default function CampaignDetailsPage() {
  const { id } = useParams()
  const { contract, address, isConnected } = useWeb3()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [donationAmount, setDonationAmount] = useState("")
  const [isDonating, setIsDonating] = useState(false)

  useEffect(() => {
    if (contract) {
      fetchCampaignDetails()
    }
  }, [contract, id])

  const fetchCampaignDetails = async () => {
    try {
      const campaignData = await contract.getCampaign(id)
      setCampaign({
        id: campaignData.id.toString(),
        owner: campaignData.owner,
        title: campaignData.title,
        description: campaignData.description,
        target: campaignData.target,
        deadline: new Date(Number(campaignData.deadline) * 1000),
        amountCollected: campaignData.amountCollected,
        image: campaignData.image,
        donators: campaignData.donators,
        donations: campaignData.donations.map((d: any) => formatEther(d)),
        category: campaignData.category,
        createdAt: new Date(Number(campaignData.createdAt) * 1000),
      })
    } catch (error) {
      console.error("Error fetching campaign details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDonate = async () => {
    if (!isConnected || !contract || !donationAmount) return

    setIsDonating(true)
    try {
      const parsedAmount = parseEther(donationAmount)
      const tx = await contract.donateToCampaign(id, {
        value: parsedAmount,
      })
      await tx.wait()
      fetchCampaignDetails()
      setDonationAmount("")
    } catch (error) {
      console.error("Error donating to campaign:", error)
      alert("Failed to donate. Please try again.")
    } finally {
      setIsDonating(false)
    }
  }

  const isOwner = campaign && address && campaign.owner.toLowerCase() === address.toLowerCase()
  const isActive = campaign && new Date(campaign.deadline) > new Date()
  const percentFunded = campaign
    ? Math.min((Number(formatEther(campaign.amountCollected)) / Number(formatEther(campaign.target))) * 100, 100)
    : 0
  const daysLeft = campaign
    ? Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-4">Loading campaign details...</p>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Campaign Not Found</h1>
        <p className="text-muted-foreground">The campaign you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
            <Image
              src={campaign.image || "/placeholder.svg?height=400&width=800"}
              alt={campaign.title}
              fill
              className="object-cover"
            />
          </div>

          <Tabs defaultValue="story" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="story">Story</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="backers">Backers</TabsTrigger>
            </TabsList>
            <TabsContent value="story" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">About This Project</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{campaign.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="updates" className="mt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No updates yet.</p>
                {isOwner && <Button className="mt-4">Post an Update</Button>}
              </div>
            </TabsContent>
            <TabsContent value="backers" className="mt-6">
              <h2 className="text-xl font-bold mb-4">{campaign.donators.length} Backers</h2>
              {campaign.donators.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No backers yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaign.donators.map((donator: string, i: number) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">
                          {donator.slice(0, 6)}...{donator.slice(-4)}
                        </p>
                      </div>
                      <p className="font-medium">Ξ {campaign.donations[i]}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <h1 className="text-2xl font-bold mb-2">{campaign.title}</h1>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full mr-2">
                  {campaign.category}
                </span>
                <span>
                  by {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Ξ {formatEther(campaign.amountCollected)}</span>
                    <span className="text-muted-foreground">
                      {percentFunded.toFixed(0)}% of Ξ {formatEther(campaign.target)}
                    </span>
                  </div>
                  <Progress value={percentFunded} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Backers</p>
                    <p className="font-medium text-lg">{campaign.donators.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{isActive ? "Days Left" : "Campaign Ended"}</p>
                    <p className="font-medium text-lg">{isActive ? daysLeft : "0"}</p>
                  </div>
                </div>
              </div>

              {isActive ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="ETH Amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      disabled={!isConnected || isDonating}
                    />
                    <Button onClick={handleDonate} disabled={!isConnected || !donationAmount || isDonating}>
                      {isDonating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Donating...
                        </>
                      ) : (
                        "Donate"
                      )}
                    </Button>
                  </div>
                  {!isConnected && (
                    <p className="text-sm text-muted-foreground">Connect your wallet to donate to this campaign.</p>
                  )}
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="font-medium">This campaign has ended</p>
                </div>
              )}
            </div>

            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <h3 className="font-semibold mb-2">Campaign Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDistanceToNow(campaign.createdAt, { addSuffix: true })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span>{format(campaign.deadline, "MMM d, yyyy")}</span>
                </div>
                {isOwner && (
                  <Button variant="outline" className="w-full mt-4">
                    Manage Campaign
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
