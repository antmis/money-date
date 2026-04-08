import { useState } from 'react'
import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { PageSkeleton } from '@/shared/components'
import { useBusinessActivity } from '@/features/business-activity/hooks/useBusinessActivity'
import { BusinessActivityDialog } from '@/features/business-activity/components/BusinessActivityDialog'
import { BusinessActivityTable } from '@/features/business-activity/components/BusinessActivityTable'
import type { BusinessActivity } from '@/features/business-activity/types'

export function BusinessActivity() {
  const [addOpen, setAddOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<BusinessActivity | null>(null)
  const { entries, addEntry, updateEntry, deleteEntry, loading } = useBusinessActivity()
  if (loading) return <PageSkeleton />

  return (
    <PageContainer>
      <SectionHeader
        title="Biz Activity"
        description="Business transactions recorded through personal accounts — expenses and income to reconcile with Xero."
        buttonAction={() => setAddOpen(true)}
        buttonText="Add Entry"
      />

      <BusinessActivityTable entries={entries} onEdit={setEditingEntry} />

      {/* Add dialog */}
      <BusinessActivityDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={addEntry}
      />

      {/* Edit dialog */}
      <BusinessActivityDialog
        open={!!editingEntry}
        onOpenChange={(open) => { if (!open) setEditingEntry(null) }}
        onAdd={addEntry}
        onUpdate={updateEntry}
        onDelete={deleteEntry}
        entry={editingEntry ?? undefined}
      />
    </PageContainer>
  )
}
