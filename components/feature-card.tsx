import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  // Dynamically get the icon component
  const IconComponent = Icons[icon as keyof typeof Icons] as LucideIcon

  return (
    <Card className="flex flex-col items-center text-center">
      <CardHeader>
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
          {IconComponent && <IconComponent className="h-6 w-6 text-teal-600" />}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">{description}</p>
      </CardContent>
    </Card>
  )
}
