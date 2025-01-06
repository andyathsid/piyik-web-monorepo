"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button, buttonVariants } from "@/components/ui/button";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { LogoIcon } from "@/components/home/Icons";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";
import { getAuthUser } from "@/actions/getAuthUser";
import { auth } from "@/lib/firebase/client";
import { ButtonLink } from "@/components/ButtonLink"
import { Spinner } from "@/components/ui/spinner";
import { LoginLink } from "./LoginLink";
import { NavLink } from "@/components/NavLink"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

// Add submenu items
const navigationRoutes = [
  {
    href: "/",
    label: "Home",
    subItems: []
  },
  {
    href: "/dashboard",
    label: "Piyik Dashboard",
    requireAuth: true,
    subItems: []
  },
  {
    href: "/model",
    label: "Piyik Vision",
    subItems: []
  },
];

export const Navbar = () => {
  const [authUserData, authUserAction, pending] = useActionState(getAuthUser, {
    user: {
      id: '',
      name: '',
      email: '',
    },
    error: '',
    success: false,
  });

  useEffect(() => {
    const fetchData = () => {
      startTransition(() => {
        authUserAction();
      });
    };
    fetchData();
    console.log(authUserData);
  }, []);


  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky border-b-[1px] top-0 z-40 w-full bg-white/80 backdrop-blur-sm dark:border-b-slate-700 dark:bg-background/80"
    >
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-16 px-4 w-screen flex items-center justify-between">
          {/* Logo */}
          <NavigationMenuItem className="font-bold flex items-center">
            <Link href="/" className="ml-2 font-bold text-xl flex items-center gap-2">
            </Link>
          </NavigationMenuItem>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <nav className="flex flex-col gap-2">
                    {navigationRoutes.map((route) => (
                      <ButtonLink
                        key={route.href}
                        href={route.href}
                        onClick={() => setIsOpen(false)}
                        className={buttonVariants({ variant: "ghost", className: "w-full justify-start" })}
                      >
                        {route.label}
                      </ButtonLink>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationRoutes.map((route) => (
              <NavigationMenuItem key={route.href}>
                <NavLink
                  href={route.href}
                  isAuthenticated={route.requireAuth ? authUserData?.success : undefined}
                >
                  {route.label}
                </NavLink>
              </NavigationMenuItem>
            ))}
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4">
            <Spinner show={pending} size="medium" />
            {authUserData?.success ? (
              <UserNav
                userName={authUserData?.user.name as string}
                userEmail={authUserData?.user.email as string}
                userId={authUserData?.user.id as string}
              />
            ) : !pending ? (
              <LoginLink redirectBack>Login</LoginLink>
            ) : null}
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </motion.header>
  );
};