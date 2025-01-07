'use client';

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Login } from "@/actions/auth";
import { useEffect, useActionState, startTransition } from "react";
import { GoogleLogin } from "@/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackButton } from "@/components/auth/BackButton";

const googleLoginAction = async (state: { success: boolean; error: string; }, idToken: string) => {
  return await GoogleLogin(idToken, state);
};

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get("callbackUrl")

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();

  const [state, formAction, pending] = useActionState(Login, {
    errors: {},
    email: "",
    generalError: "",
    success: false,
  });

  const [googleState, googleAction, googlePending] = useActionState(googleLoginAction, {
    success: false,
    error: '',
  });

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Success",
        description: "Successfully logged in",
      });
      router.push(callbackUrl || '/');
    }
  }, [state?.success, callbackUrl, router]);

  useEffect(() => {
    if (googleState?.success) {
      toast({
        title: "Success",
        description: "Successfully logged in",
      });
      router.push(callbackUrl || '/');
    }
  }, [googleState?.success, callbackUrl, router]);


  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();

      startTransition(() => {
        googleAction(idToken);
      });

      if (googleState?.success) {
        toast({
          title: "Success",
          description: "Successfully logged in with Google",
        });
        router.push(callbackUrl || '/');
      }
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request') {
        toast({
          variant: "destructive",
          title: "Login cancelled",
          description: "The login popup was closed",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || 'An unexpected error occurred',
        });
      }
      redirect('/login');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 relative">
      <BackButton />
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6")} >
          {state?.generalError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.generalError}</AlertDescription>
            </Alert>
          )}
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8 relative" action={formAction}>
                <Spinner 
                  show={pending || googlePending || isGoogleLoading} 
                  size="medium"
                >
                  Loading...
                </Spinner>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Selamat Datang Kembali</h1>
                    <p className="text-balance text-muted-foreground">
                      Masuk ke Akun Piyik Anda
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      required
                      defaultValue={state?.email}
                      aria-describedby={
                        state?.errors?.email ? "email-error" : undefined
                      }
                    />
                    {state?.errors?.email && (
                      <p className="text-sm text-red-500" id="email-error">
                        {state.errors.email[0]}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Kata Sandi</Label>
                      <Link
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Lupa kata sandi?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      aria-describedby={
                        state?.errors?.password ? "password-error" : undefined
                      }
                    />
                    {state?.errors?.password && (
                      <p className="text-sm text-red-500" id="password-error">
                        {state.errors.password[0]}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full relative">
                    Masuk
                  </Button>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Atau
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-1">
                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Masuk dengan Google
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Belum punya akun?{" "}
                    <Link href="/register" className="underline underline-offset-4">
                      Daftar
                    </Link>
                  </div>
                </div>
              </form>
              <div className="relative hidden bg-muted md:block">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="w-40 h-40 mb-4">
                    <img
                      src="/piyik.png"
                      alt="Logo Piyik"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-2">Selamat Datang di Piyik</h2>
                  <p className="text-muted-foreground text-center max-w-sm">
                    Teknologi Inkubator Pintar untuk Hasil Penetasan yang Lebih Baik
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-background/20 dark:from-background/80 dark:to-background/40" />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            Dengan melanjutkan, Anda menyetujui <a href="#">Ketentuan Layanan</a>{" "}
            dan <a href="#">Kebijakan Privasi</a> kami.
          </div>
        </div>
      </div>
    </div>
  )
}
