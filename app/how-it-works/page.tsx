import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Code, Coins, FileText, Lightbulb, Shield, Wallet } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">How CrowdChain Works</h1>
        <p className="text-xl text-muted-foreground">
          A transparent, secure, and decentralized way to fund your projects
        </p>
      </div>

      <div className="grid gap-12 mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block p-3 bg-primary/10 rounded-lg mb-4">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">1. Create Your Campaign</h2>
            <p className="text-muted-foreground mb-4">
              Start by creating your campaign with a compelling title, description, funding goal, and deadline. Add
              images and select a category to help your campaign stand out.
            </p>
            <p className="text-muted-foreground mb-4">
              Your campaign is stored directly on the blockchain, ensuring complete transparency and immutability.
            </p>
            <Button asChild className="mt-2">
              <Link href="/campaigns/create">
                Create a Campaign <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="bg-muted p-6 rounded-lg border">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Campaign Title</h3>
                <div className="h-8 bg-background rounded w-full"></div>
              </div>
              <div>
                <h3 className="font-medium mb-1">Description</h3>
                <div className="h-20 bg-background rounded w-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Target Amount</h3>
                  <div className="h-8 bg-background rounded w-full"></div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Deadline</h3>
                  <div className="h-8 bg-background rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="bg-muted p-6 rounded-lg border">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Campaign Progress</h3>
                    <p className="text-sm text-muted-foreground">65% of Ξ 5.0 ETH</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Ξ 3.25 ETH</p>
                    <p className="text-sm text-muted-foreground">from 24 backers</p>
                  </div>
                </div>
                <div className="w-full bg-background rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full w-[65%]"></div>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Amount to donate:</span>
                    <span>Balance: Ξ 10.0 ETH</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-background rounded flex-1"></div>
                    <div className="h-10 bg-primary rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="inline-block p-3 bg-primary/10 rounded-lg mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">2. Receive Contributions</h2>
            <p className="text-muted-foreground mb-4">
              Supporters can contribute ETH directly to your campaign. Every transaction is recorded on the blockchain,
              providing complete transparency.
            </p>
            <p className="text-muted-foreground mb-4">
              Funds are transferred directly to your wallet when a contribution is made, giving you immediate access to
              the funds.
            </p>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/campaigns">
                Browse Campaigns <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block p-3 bg-primary/10 rounded-lg mb-4">
              <Coins className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">3. Build Your Project</h2>
            <p className="text-muted-foreground mb-4">
              Use the funds to bring your project to life. Since contributions are sent directly to your wallet, there's
              no waiting period to access your funds.
            </p>
            <p className="text-muted-foreground mb-4">
              Keep your backers updated on your progress by posting updates to your campaign page.
            </p>
          </div>
          <div className="bg-muted p-6 rounded-lg border">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Post Updates</h3>
                  <p className="text-sm text-muted-foreground">Keep your backers informed</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                  <Shield className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Build Trust</h3>
                  <p className="text-sm text-muted-foreground">Transparency builds community</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                  <Code className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Deliver Your Project</h3>
                  <p className="text-sm text-muted-foreground">Bring your vision to life</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center bg-muted p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6">Join the community of creators and backers on CrowdChain today.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/campaigns/create">Start a Campaign</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/campaigns">Browse Campaigns</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
