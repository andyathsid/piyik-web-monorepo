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
import { Logo } from "@/components/Logo";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";
import { getAuthUser } from "@/actions/getAuthUser";
import { auth } from "@/lib/firebase/client";
import { ButtonLink } from "@/components/ButtonLink"
import { Spinner } from "@/components/ui/spinner";
import { LoginLink } from "./LoginLink";
import { NavLink } from "@/components/NavLink"
import { Input } from "@/components/ui/input"
import { motion, useScroll } from "framer-motion"
import { usePathname } from "next/navigation";

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
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 0);
    });

    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-sm border-b-[1px] dark:border-b-slate-700 dark:bg-background/80 text-black dark:text-white" 
          : isHomePage
            ? "bg-transparent border-b-0 text-white"
            : "bg-transparent border-b-0 text-black dark:text-white"
      }`}
    >
      <NavigationMenu className="mx-auto">
        <NavigationMenuList 
          className={`container h-16 px-4 w-screen flex items-center justify-between ${
            isScrolled 
              ? "text-black dark:text-white" 
              : isHomePage
                ? "text-white"
                : "text-black dark:text-white"
          }`}
        >
          {/* Logo */}
          <NavigationMenuItem className="font-bold flex items-center">
            <Link href="/" className="ml-2 font-bold text-xl flex items-center gap-2">
              <Logo className={isScrolled ? "opacity-100" : "opacity-90"} />
              <span className={`${
                isScrolled 
                  ? "text-black dark:text-white" 
                  : isHomePage
                    ? "text-white"
                    : "text-black dark:text-white"
              }`}>
                PIYIK
              </span>
            </Link>
          </NavigationMenuItem>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className={
                isScrolled 
                  ? "text-black dark:text-white" 
                  : isHomePage
                    ? "text-white"
                    : "text-black dark:text-white"
              }
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationRoutes.map((route) => (
              <NavigationMenuItem key={route.href}>
                <NavLink
                  href={route.href}
                  isAuthenticated={route.requireAuth ? authUserData?.success : undefined}
                  className={
                    isScrolled 
                      ? "text-black dark:text-white hover:text-black/80 dark:hover:text-white/80" 
                      : isHomePage
                        ? "text-white hover:text-white/80"
                        : "text-black dark:text-white hover:text-black/80 dark:hover:text-white/80"
                  }
                >
                  {route.label}
                </NavLink>
              </NavigationMenuItem>
            ))}
          </nav>

          {/* User Section */}
          <div className={`hidden md:flex items-center gap-4 ${
            isScrolled 
              ? "text-black dark:text-white" 
              : isHomePage
                ? "text-white"
                : "text-black dark:text-white"
          }`}>
            <Spinner show={pending} size="medium" />
            {authUserData?.success ? (
              <UserNav
                userName={authUserData?.user.name as string}
                userEmail={authUserData?.user.email as string}
                userId={authUserData?.user.id as string}
                isScrolled={isScrolled}
                className={
                  isScrolled 
                    ? "text-black dark:text-white hover:text-black/80 dark:hover:text-white/80" 
                    : isHomePage
                      ? "text-white hover:text-white/80"
                      : "text-black dark:text-white hover:text-black/80 dark:hover:text-white/80"
                }
              />
            ) : !pending ? (
              <LoginLink 
                redirectBack
                className={
                  isScrolled 
                    ? "text-black dark:text-white hover:text-black/80 dark:hover:text-white/80" 
                    : isHomePage
                      ? "text-white hover:text-white/80"
                      : "text-black dark:text-white hover:text-black/80 dark:hover:text-white/80"
                }
              >
                Login
              </LoginLink>
            ) : null}
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </motion.header>
  );
};