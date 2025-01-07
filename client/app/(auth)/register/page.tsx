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
              Memuat...
            </Spinner>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a href="#" className="flex flex-col items-center gap-2 font-medium">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">Piyik</span>
                </a>
                <h1 className="text-xl font-bold">Buat Akun Baru</h1>
                <div className="text-center text-sm">
                  Sudah punya akun?{" "}
                  <Link 
                    href={`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} 
                    className="underline underline-offset-4"
                  >
                    Masuk
                  </Link>
                </div>
                {state?.generalError && (
                  <p className="text-sm text-red-500 mt-2">{state.generalError}</p>
                )}
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama</Label>
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
                  <Label htmlFor="password">Kata Sandi</Label>
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
                  <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
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
                  Daftar
                </Button>
              </div>
            </div>
          </form>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            Dengan melanjutkan, Anda menyetujui <a href="#">Ketentuan Layanan</a>{" "}
            dan <a href="#">Kebijakan Privasi</a> kami.
          </div>
        </div>
      </div>
    </div>
  )
}
