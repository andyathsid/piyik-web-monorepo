'use client';

import { AlertCircle } from "lucide-react";
import Link from 'next/link';
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Register } from "@/actions/auth";
import { useEffect } from "react";
import { useActionState } from 'react';
import { GalleryVerticalEnd } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { BackButton } from "@/components/auth/BackButton";

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get("callbackUrl")
  
  const { toast } = useToast();
  const [state, formAction, pending] = useActionState(Register, {
    errors: {},
    email: '',
    name: '',
    generalError: '',
    success: false
  });

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Success",
        description: "Successfully registered!",
      });
      router.push(callbackUrl || '/dashboard');
    }
  }, [state?.success, callbackUrl, router]);

  return (
    <div className="flex relative min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <BackButton />
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")} >
          {state?.generalError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.generalError}</AlertDescription>
            </Alert>
          )}
          <form className="p-6 md:p-8 relative" action={formAction}>
            <Spinner show={pending} size="medium">
              Loading...
            </Spinner>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a href="#" className="flex flex-col items-center gap-2 font-medium">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">Piyik</span>
                </a>
                <h1 className="text-xl font-bold">Create an account</h1>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link 
                    href={`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} 
                    className="underline underline-offset-4"
                  >
                    Login
                  </Link>
                </div>
                {state?.generalError && (
                  <p className="text-sm text-red-500 mt-2">{state.generalError}</p>
                )}
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    defaultValue={state?.name}
                    aria-describedby={state?.errors?.name ? "name-error" : undefined}
                  />
                  {state?.errors?.name && (
                    <p className="text-sm text-red-500" id="name-error">
                      {state.errors.name[0]}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    defaultValue={state?.email}
                    aria-describedby={state?.errors?.email ? "email-error" : undefined}
                  />
                  {state?.errors?.email && (
                    <p className="text-sm text-red-500" id="email-error">
                      {state.errors.email[0]}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    aria-describedby={state?.errors?.password ? "password-error" : undefined}
                  />
                  {state?.errors?.password && (
                    <p className="text-sm text-red-500" id="password-error">
                      {state.errors.password[0]}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    aria-describedby={state?.errors?.confirmPassword ? "confirm-password-error" : undefined}
                  />
                  {state?.errors?.confirmPassword && (
                    <p className="text-sm text-red-500" id="confirm-password-error">
                      {state.errors.confirmPassword[0]}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </div>
              {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
              <div className="grid sm:grid-cols-1">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div> */}
            </div>
          </form>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  )
}
