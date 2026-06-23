"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm } from "react-hook-form";
import { placeBid } from "@/app/action";

type FormValues = {
  amount: number;
};

export default function BidPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("auctionId", id);
    formData.append("amount", data.amount.toString());
    await placeBid(formData);
  };

  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle>Place a bid</CardTitle>
          <CardDescription>
            Place a bid on an auction to compete with other bidders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                {...register("amount", {
                  required: "Amount is required",
                })}
                placeholder="Amount"
              />
              {errors.amount && <p>{errors.amount.message}</p>}
            </div>
            <Button type="submit" nativeButton={true} className="mt-2">
              Place Bid
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
