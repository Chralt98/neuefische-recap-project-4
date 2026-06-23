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
import { useForm } from "react-hook-form";
import { createAuction } from "@/app/action";

type FormValues = {
  title: string;
  description: string;
  startingPrice: number;
  endDate?: Date;
};

export default function CreateAuctionPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("startingPrice", data.startingPrice.toString());
    if (data.endDate) {
      formData.append("endDate", new Date(data.endDate).toISOString());
    }
    await createAuction(formData);
  };

  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle>Create a new auction</CardTitle>
          <CardDescription>
            Create a new auction to sell your items to the highest bidder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Title must be at most 100 characters",
                  },
                })}
                placeholder="Title"
              />
              {errors.title && <p>{errors.title.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                  maxLength: {
                    value: 500,
                    message: "Description must be at most 500 characters",
                  },
                })}
                placeholder="Description"
              />
              {errors.description && <p>{errors.description.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startingPrice">Starting Price</Label>
              <Input
                type="number"
                {...register("startingPrice", {
                  required: "Starting price is required",
                  min: {
                    value: 1,
                    message: "Starting price must be at least 1",
                  },
                })}
                placeholder="Starting Price"
              />
              {errors.startingPrice && <p>{errors.startingPrice.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date (optional)</Label>
              <Input
                type="datetime-local"
                {...register("endDate")}
                placeholder="End Date"
              />
              {errors.endDate && <p>{errors.endDate.message}</p>}
            </div>
            <Button type="submit" nativeButton={true} className="mt-2">
              Create Auction
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
