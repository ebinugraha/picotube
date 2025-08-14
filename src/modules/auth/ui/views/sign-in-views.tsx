"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, TriangleAlert } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";

export const SignInView = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const onGoogleSignIn = () => {
    setIsLoading(true);
    setError(null);
    authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onSuccess: () => {
          setIsLoading(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setIsLoading(false);
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col text-white gap-6">
      <Card className="overflow-hidden w-full p-0">
        <CardContent className=" grid grid-cols-1 p-0">
          {/* this section for form */}
          <div className="flex flex-col gap-y-6 p-6">
            {/* header */}
            <div className="flex flex-col gap-y-2">
              <div className="flex gap-x-2 items-center">
                <Image src={"/logo.svg"} alt="logo" height={32} width={32} />
                <h1 className="font-bold text-2xl">PicoTube</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Masuk ke PicoTube
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                className="w-full"
                variant={"outline"}
                onClick={onGoogleSignIn}
              >
                <FcGoogle />
                Google
              </Button>
            
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <a className="#">Term of service</a> and{" "}
        <a className="#">Privacy policy</a>.
      </div>
    </div>
  );
};