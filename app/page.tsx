import Link from "next/link"
import { Button } from "@/components/ui/button"
import CampaignCard from "@/components/campaign-card"
import ConnectWallet from "@/components/connect-wallet"
import { getCampaigns } from "@/lib/actions"

export default async function Home() {
  const campaigns = await getCampaigns()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div className="max-w-2xl mb-8 md:mb-0">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Fund the future, together</h1>
          <p className="text-xl text-muted-foreground mb-6">
            A decentralized crowdfunding platform powered by blockchain technology. Create campaigns, support projects,
            and track your contributions with full transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/campaigns/create">Start a Campaign</Link>
            </Button>
            <ConnectWallet />
          </div>
        </div>
        <div className="w-full md:w-1/3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Platform Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-80">Total Campaigns</p>
              <p className="text-3xl font-bold">{campaigns.length}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Total Funded</p>
              <p className="text-3xl font-bold">
                Ξ {campaigns.reduce((acc, campaign) => acc + Number(campaign.amountCollected), 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-80">Success Rate</p>
              <p className="text-3xl font-bold">78%</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Contributors</p>
              <p className="text-3xl font-bold">2.4k+</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Active Campaigns</h2>
          <Button variant="outline" asChild>
            <Link href="/campaigns">View All</Link>
          </Button>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to create a campaign and start fundraising!</p>
            <Button asChild>
              <Link href="/campaigns/create">Create Campaign</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.slice(0, 6).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-muted rounded-lg p-8 mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create</h3>
              <p className="text-muted-foreground">Launch your campaign with a clear goal, timeline, and story</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Fund</h3>
              <p className="text-muted-foreground">Supporters contribute ETH directly to your campaign</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Build</h3>
              <p className="text-muted-foreground">Withdraw funds when your goal is reached and build your project</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
