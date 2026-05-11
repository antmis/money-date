import { useState } from "react"
import { Navigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "./AuthContext"
import { Button, Card, Input, Label, Typography, YStack, Field, Spinner } from "@/ui"

export function ResetPasswordPage() {
  const { user, updatePassword } = useAuth()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await updatePassword(password)
    if (err) {
      setError(err)
    } else {
      toast.success("Password updated. You're signed in.")
      setDone(true)
    }
    setLoading(false)
  }

  if (done) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <YStack gap={6} className="w-full max-w-sm">
        <form onSubmit={(e) => void handleSubmit(e)}>
          <Card
            title="Money Date"
            description="Choose a new password"
            footer={
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner /> : "Update Password"}
              </Button>
            }
          >
            <YStack gap={4}>
              <Field>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={6}
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
      </YStack>
    </div>
  )
}
