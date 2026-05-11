import { useState } from "react"
import { Navigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "./AuthContext"
import { Button, Card, Input, Label, Typography, YStack, XStack, Field, Spinner } from "@/ui"

export function LoginPage() {
  const { user, signIn, signUp } = useAuth()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === "signup") {
      const err = await signUp(email, password)
      if (err) {
        setError(err)
      } else {
        setAwaitingConfirmation(true)
        toast.success("Check your email to confirm your account.")
      }
    } else {
      const err = await signIn(email, password)
      if (err) {
        const friendly = err.toLowerCase().includes("not confirmed")
          ? "Please confirm your email before signing in."
          : err
        setError(friendly)
      }
    }

    setLoading(false)
  }

  if (user) return <Navigate to="/" replace />

  if (awaitingConfirmation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card title="Check your email" description={`We sent a confirmation link to ${email}. Click it to activate your account, then come back to sign in.`}>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => { setAwaitingConfirmation(false); setMode("signin") }}
          >
            Back to Sign In
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <YStack gap={6} className="w-full max-w-sm">
        <form onSubmit={(e) => void handleSubmit(e)}>
          <Card
            title="Money Date"
            description={mode === "signin" ? "Sign in to your account" : "Create a new account"}
            footer={
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner /> : mode === "signin" ? "Sign In" : "Create Account"}
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

              <Field>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  minLength={6}
                />
              </Field>

              {mode === "signin" && (
                <XStack justify="end">
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto"
                    onClick={() => window.location.assign("/forgot-password")}
                    type="button"
                  >
                    Forgot password?
                  </Button>
                </XStack>
              )}

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
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
          </Typography>
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto"
            onClick={() => { setMode(m => m === "signin" ? "signup" : "signin"); setError(null) }}
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </Button>
        </XStack>
      </YStack>
    </div>
  )
}
