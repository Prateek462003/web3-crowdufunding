import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Campaign } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { formatEther } from "ethers"

interface CampaignCardProps {
  campaign: Campaign
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const percentFunded = Math.min((Number(campaign.amountCollected) / Number(campaign.target)) * 100, 100)

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
  )

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={campaign.image || "/placeholder.svg?height=200&width=400"}
          alt={campaign.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/campaigns/${campaign.id}`} className="text-lg font-semibold hover:underline line-clamp-1">
              {campaign.title}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-1">
              by {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
            </p>
          </div>
          <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
            {campaign.category}
          </div>
        </div>
        <p className="text-sm line-clamp-2 mt-2">{campaign.description}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Ξ {formatEther(campaign.amountCollected)}</span>
            <span className="text-muted-foreground">
              {percentFunded.toFixed(0)}% of Ξ {formatEther(campaign.target)}
            </span>
          </div>
          <Progress value={percentFunded} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span>{campaign.donators.length} backers</span>
            <span>{daysLeft > 0 ? `${daysLeft} days left` : "Campaign ended"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Created {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
          </span>
          <Link href={`/campaigns/${campaign.id}`} className="text-sm font-medium text-primary hover:underline">
            View Details →
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
