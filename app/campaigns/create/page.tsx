"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWeb3 } from "@/lib/hooks/use-web3";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ethers } from "ethers";
import { toast } from "@/components/ui/use-toast"; // If you have toast component

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  target: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Target amount must be a positive number.",
  }),
  deadline: z.string().refine(
    (val) => {
      const date = new Date(val);
      return date > new Date();
    },
    {
      message: "Deadline must be in the future.",
    }
  ),
  image: z.string().url({
    message: "Please enter a valid image URL.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
});

export default function CreateCampaignPage() {
  const { isConnected, contract, address } = useWeb3();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      target: "",
      deadline: "",
      image: "",
      category: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Clear previous errors
    setError("");

    if (!isConnected || !contract) {
      setError("Please connect your wallet first");
      return;
    }

    console.log("Connected address:", address);
    console.log("Contract:", contract);

    setIsSubmitting(true);

    try {
      // Convert deadline to timestamp (milliseconds to seconds)
      const deadlineDate = new Date(values.deadline);
      const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000);

      // Convert target amount to Wei
      const targetAmount = ethers.parseEther(values.target);

      console.log("Creating campaign with parameters:", {
        title: values.title,
        description: values.description,
        target: targetAmount.toString(),
        deadline: deadlineTimestamp,
        image: values.image,
        category: values.category,
      });

      try {
        // Estimate gas to check if transaction will succeed
        const gasEstimate = await contract.createCampaign.estimateGas(
          values.title,
          values.description,
          targetAmount,
          deadlineTimestamp,
          values.image,
          values.category
        );

        console.log("Gas estimate:", gasEstimate.toString());

        // Add 20% buffer to gas estimate
        const gasLimit = Math.floor(Number(gasEstimate) * 1.2);

        // Send transaction with gas limit
        const tx = await contract.createCampaign(
          values.title,
          values.description,
          targetAmount,
          deadlineTimestamp,
          values.image,
          values.category,
          { gasLimit }
        );

        console.log("Transaction sent:", tx.hash);

        // Wait for transaction confirmation
        console.log("Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        router.push("/campaigns");
      } catch (err: any) {
        console.error("Contract call failed:", err);

        // Parse the error
        if (err.reason) {
          setError(`Contract error: ${err.reason}`);
        } else if (err.data?.message) {
          setError(`Contract error: ${err.data.message}`);
        } else {
          setError(
            "Failed to create campaign. Please check console for details."
          );
        }
      }
    } catch (error: any) {
      console.error("Error creating campaign:", error);

      // More detailed error handling
      if (error.code === "ACTION_REJECTED") {
        setError("Transaction was rejected by the user");
      } else if (error.reason) {
        setError(`Transaction failed: ${error.reason}`);
      } else if (error.message) {
        setError(`Error: ${error.message}`);
      } else {
        setError("Failed to create campaign. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-muted-foreground mb-6">
          You need to connect your wallet to create a campaign.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create a Campaign</h1>
        <p className="text-muted-foreground mb-8">
          Fill out the form below to start your crowdfunding campaign
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campaign title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Create a clear, attention-grabbing title for your campaign.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your campaign in detail"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Explain what your campaign is about, why you need funding,
                    and how you'll use it.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount (ETH)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      How much ETH do you need to raise?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      When will your campaign end?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a URL to an image that represents your campaign.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="art">Art & Creative</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="defi">DeFi</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category that best fits your campaign.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Campaign...
                </>
              ) : (
                "Create Campaign"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
