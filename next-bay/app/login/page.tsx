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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { login as loginSubmit } from "@/app/action";

type FormValues = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    const result = await loginSubmit(formData);
    if (!result.success) {
      alert(result.error);
      return;
    }
    router.push("/");
  };

  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Login an existing account to access exclusive routes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Username must be at most 100 characters",
                  },
                })}
                placeholder="Username"
              />
              {errors.username && <p>{errors.username.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "password must be at least 8 characters",
                  },
                  maxLength: {
                    value: 30,
                    message: "password must be at most 30 characters",
                  },
                })}
                placeholder="password"
              />
              {errors.password && <p>{errors.password.message}</p>}
            </div>
            <Button type="submit" nativeButton={true} className="mt-2">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
