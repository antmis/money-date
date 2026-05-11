import { useState, useEffect } from 'react'
import { MapPin, Pencil } from 'lucide-react'
import { PageContainer } from '@/shared/layout'
import { PageSkeleton, SectionHeader } from '@/shared/components'
import { Card, Field, Grid, Input, Label, Button, XStack, Typography, Item, YStack } from '@/ui'
import { LocationDialogs } from '@/features/reimbursements/components/LocationDialogs'
import { useOfficeTemplates } from '@/features/reimbursements/hooks/useOfficeTemplates'
import { useAuth } from '@/features/auth'
import { useProfile } from './hooks/useProfile'
import { useProfileLocationDialogs } from './hooks/useProfileLocationDialogs'

export function ProfilePage() {
  const { user } = useAuth()
  const { profile, loading, saveProfile } = useProfile()
  const { templates, archivedTemplates, addTemplate, updateTemplate, archiveTemplate, loading: locLoading } = useOfficeTemplates()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    if (!loading) {
      setFirstName(profile.firstName)
      setLastName(profile.lastName)
    }
  }, [loading, profile.firstName, profile.lastName])

  const locationDialogs = useProfileLocationDialogs({ templates, addTemplate, updateTemplate, archiveTemplate })

  const isDirty = firstName !== profile.firstName || lastName !== profile.lastName

  if (loading || locLoading) return <PageSkeleton />

  return (
    <PageContainer>
      <SectionHeader title="Profile" />

      {/* Personal Info */}
      <Card title="Personal info">
        <Grid cols={2}>
          <Field>
            <Label htmlFor="first-name">First name</Label>
            <Input
              id="first-name"
              placeholder="Bob"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </Field>
          <Field>
            <Label htmlFor="last-name">Last name</Label>
            <Input
              id="last-name"
              placeholder="Belcher"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </Field>
        </Grid>

        <Field>
          <Label>Email</Label>
          <Input value={user?.email ?? ''} disabled />
        </Field>

        <XStack justify="end">
          <Button disabled={!isDirty} onClick={() => void saveProfile(firstName, lastName)}>
            Save
          </Button>
        </XStack>
      </Card>

      {/* Office Locations */}
      <Card
        title="Office locations"
        description="Used to calculate your home office reimbursement percentage."
        headerExtra={
          <Button onClick={locationDialogs.openAdd}>
            Add Location
          </Button>
        }
      >
        {templates.length === 0 ? (
          <Typography variant="muted" className="py-2 text-center">
            No office locations yet. Click "Add Location" to get started.
          </Typography>
        ) : (
          <YStack gap={2}>
            {templates.map((t, i) => (
              <Item
                key={t.id}
                variant="outline"
                icon={<MapPin />}
                title={t.name}
                description={t.address || undefined}
                action={
                  <Button variant="outline" size="icon-sm" onClick={() => locationDialogs.openEdit(i)} aria-label="Edit location">
                    <Pencil />
                  </Button>
                }
              />
            ))}
          </YStack>
        )}

        {archivedTemplates.length > 0 && (
          <YStack gap={2} className="mt-2">
            <Typography variant="muted" className="pt-2">
              Archived
            </Typography>
            <YStack gap={2}>
              {archivedTemplates.map(t => (
                <Item
                  key={t.id}
                  variant="outline"
                  icon={<MapPin />}
                  title={t.name}
                  description={t.address || undefined}
                  className="opacity-50"
                />
              ))}
            </YStack>
          </YStack>
        )}
      </Card>

      <LocationDialogs {...locationDialogs} archiveMode />
    </PageContainer>
  )
}
