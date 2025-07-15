"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, ArrowLeft } from "lucide-react"

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: ProfileData) => void
  initialData: ProfileData
}

interface ProfileData {
  name: string
  email: string
  avatar?: string
}

export function EditProfileModal({ open, onOpenChange, onSave, initialData }: EditProfileModalProps) {
  const [name, setName] = useState(initialData.name)
  const [email, setEmail] = useState(initialData.email)
  const [avatar, setAvatar] = useState(initialData.avatar || "/placeholder.svg?height=100&width=100")

  const handleSave = () => {
    onSave({
      name,
      email,
      avatar,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-lg p-0 overflow-hidden">
        <div className="bg-[#f5f5f5] dark:bg-gray-900">
          <DialogHeader className="relative p-6 text-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-4 h-8 w-8 rounded-full p-0"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center px-6 pb-6">
            <div className="relative mb-6">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={avatar || "/placeholder.svg"} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                <Camera className="h-4 w-4" />
                <span className="sr-only">Change avatar</span>
              </Button>
            </div>

            <div className="space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-0">
            <Button onClick={handleSave} className="w-full rounded-full bg-primary">
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
