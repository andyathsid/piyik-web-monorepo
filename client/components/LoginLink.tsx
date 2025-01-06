import * as React from "react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface LoginLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  redirectBack?: boolean
  redirectTo?: string
}

const LoginLink = React.forwardRef<HTMLAnchorElement, LoginLinkProps>(
  ({ className, variant, size, asChild = false, redirectBack = false, redirectTo, ...props }, ref) => {
    const pathname = usePathname()
    
    // Construct the login URL with redirect parameter if needed
    const href = React.useMemo(() => {
      if (redirectBack) {
        return `/login?callbackUrl=${encodeURIComponent(pathname)}`
      }
      if (redirectTo) {
        return `/login?callbackUrl=${encodeURIComponent(redirectTo)}`
      }
      return '/login'
    }, [pathname, redirectBack, redirectTo])

    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
LoginLink.displayName = "LoginLink"

export { LoginLink } 