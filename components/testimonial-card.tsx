import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
}

export function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex-1 pt-6">
        <div className="mb-4 text-2xl font-bold text-teal-600">"</div>
        <p className="text-gray-700">{quote}</p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </CardFooter>
    </Card>
  )
}
