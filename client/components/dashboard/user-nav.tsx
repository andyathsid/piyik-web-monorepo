import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/auth/sessions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useActionState } from "react"
import { updateProfile, sendPasswordReset } from "@/app/actions/profile"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { redirect } from "next/navigation"

interface UserNavProps {
  userName?: string;
  userEmail?: string;
  userId?: string;
}

export function UserNav({ userName, userEmail, userId }: UserNavProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [profileState, profileAction, profilePending] = useActionState(updateProfile, {
    success: false,
    error: "",
    name: userName || "",
  });

  const [resetState, resetAction, resetPending] = useActionState(sendPasswordReset, {
    success: false,
    error: "",
  });

  console.log(userId);
  useEffect(() => {
    if (profileState?.success) {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      redirect('/dashboard');
    } else if (profileState?.error) {
      toast({
        title: "Error",
        description: profileState.error,
        variant: "destructive",
      });
    }
  }, [profileState?.success, profileState?.error, toast]);

  useEffect(() => {
    if (resetState?.success) {
      toast({
        title: "Success",
        description: "Password reset email sent",
      });
      redirect('/dashboard');
    } else if (resetState?.error) {
      toast({
        title: "Error",
        description: resetState.error,
        variant: "destructive",
      });
    }
  }, [resetState?.success, resetState?.error, toast]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {/* <AvatarImage src="/avatars/01.png" alt="@shadcn" /> */}
                <AvatarFallback>{userName?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail || 'user@example.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>
              Update your profile information or reset your password.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <form action={profileAction} className="space-y-4">
                <input type="hidden" name="uid" value={userId} />
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={userName}
                    placeholder="Your name"
                    disabled={profilePending}
                  />
                </div>
                <Button type="submit" disabled={profilePending}>
                  {profilePending ? "Updating..." : "Update profile"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="security">
              <form action={resetAction} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Click below to receive a password reset email at {userEmail}
                  </p>
                </div>
                <input type="hidden" name="email" value={userEmail} />  
                <Button type="submit" disabled={resetPending}>
                  {resetPending ? "Sending..." : "Send reset email"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}