import { CheckIcon } from "lucide-react"

interface VerificationBadgeProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function VerificationBadge({ size = "md", className = "" }: VerificationBadgeProps) {
  const sizeClasses = {
    sm: "h-3 w-3 p-0.5",
    md: "h-4 w-4 p-0.5",
    lg: "h-5 w-5 p-0.5",
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-blue-500 ${sizeClasses[size]} ${className}`}
    >
      <CheckIcon className="h-full w-full text-white" strokeWidth={3} />
    </span>
  )
}
