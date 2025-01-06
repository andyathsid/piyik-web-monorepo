import * as React from "react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  href: string
  asChild?: boolean
  redirectBack?: boolean
  redirectTo?: string
  isAuthenticated?: boolean
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, size, asChild = false, href, redirectBack = false, redirectTo, isAuthenticated = false, ...props }, ref) => {
    const pathname = usePathname()
    
    // Construct the final href with redirect parameter if needed
    const finalHref = React.useMemo(() => {
      // If not authenticated and trying to access protected routes, redirect to login
      if (!isAuthenticated) {
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

    return (
      <Link
        href={finalHref}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
ButtonLink.displayName = "ButtonLink"

export { ButtonLink }