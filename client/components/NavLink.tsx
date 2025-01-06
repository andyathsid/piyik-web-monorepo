import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface NavLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  asChild?: boolean
  redirectBack?: boolean
  redirectTo?: string
  isAuthenticated?: boolean
}

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, asChild = false, href, redirectBack = false, redirectTo, isAuthenticated = false, ...props }, ref) => {
    const pathname = usePathname()
    
    // Construct the final href with redirect parameter if needed
    const finalHref = React.useMemo(() => {
      // If not authenticated and trying to access protected routes, redirect to login
      if (!isAuthenticated && (href === '/dashboard' || href.startsWith('/dashboard/'))) {
        if (redirectBack) {
          return `/login?callbackUrl=${encodeURIComponent(pathname)}`
        }
        if (redirectTo) {
          return `/login?callbackUrl=${encodeURIComponent(redirectTo)}`
        }
        return `/login?callbackUrl=${encodeURIComponent(href)}`
      }
      return href
    }, [href, pathname, redirectBack, redirectTo, isAuthenticated])

    const isActive = pathname === href

    return (
      <Link
        href={finalHref}
        className={cn(
          "relative px-3 py-1.5 text-sm font-medium transition-all duration-300 ease-in-out",
          "hover:text-primary",
          "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100",
          isActive ? 
            "text-primary after:scale-x-100" : 
            "text-muted-foreground after:scale-x-0",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
NavLink.displayName = "NavLink"

export { NavLink } 