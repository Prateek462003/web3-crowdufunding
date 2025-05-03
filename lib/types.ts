export interface Campaign {
  id: string
  owner: string
  title: string
  description: string
  target: bigint
  deadline: Date
  amountCollected: bigint
  image: string
  donators: string[]
  donations: string[]
  category: string
  createdAt: Date
}
