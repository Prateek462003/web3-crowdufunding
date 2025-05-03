import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CampaignCard from "@/components/campaign-card"
import Link from "next/link"
import { getCampaigns } from "@/lib/actions"

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Campaigns</h1>
          <p className="text-muted-foreground">Discover and support innovative projects</p>
        </div>
        <Button asChild>
          <Link href="/campaigns/create">Create Campaign</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 md:col-span-2">
          <Input placeholder="Search campaigns..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select defaultValue="newest">
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="funded">Most Funded</SelectItem>
              <SelectItem value="ending">Ending Soon</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="art">Art & Creative</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="defi">DeFi</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-16 bg-muted rounded-lg">
          <h3 className="text-xl font-medium mb-2">No campaigns found</h3>
          <p className="text-muted-foreground mb-6">Be the first to create a campaign and start fundraising!</p>
          <Button asChild>
            <Link href="/campaigns/create">Create Campaign</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  )
}
