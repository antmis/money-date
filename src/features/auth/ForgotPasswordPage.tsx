import { useState } from "react"
import { useAuth } from "./AuthContext"
import { Button, Card, Input, Label, Typography, YStack, XStack, Field, Spinner } from "@/ui"

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await resetPassword(email)
    if (err) {
      setError(err)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <YStack gap={6} className="w-full max-w-sm">
          <Card
            title="Check your email"
            description={`We sent a password reset link to ${email}. Click it to choose a new password.`}
          >
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSent(false)}
            >
              Send again
            </Button>
          </Card>
        </YStack>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <YStack gap={6} className="w-full max-w-sm">
        <form onSubmit={(e) => void handleSubmit(e)}>
          <Card
            title="Money Date"
            description="Reset your password"
            footer={
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner /> : "Send Reset Link"}
              </Button>
            }
          >
            <YStack gap={4}>
              <Field>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </Field>

              {error && (
                <Typography variant="small" className="text-destructive">
                  {error}
                </Typography>
              )}
            </YStack>
          </Card>
        </form>

        <XStack justify="center" gap={1}>
          <Typography variant="muted" as="span">
            Remember it?
          </Typography>
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto"
            onClick={() => window.location.assign("/login")}
          >
            Sign in
          </Button>
        </XStack>
      </YStack>
    </div>
  )
}
