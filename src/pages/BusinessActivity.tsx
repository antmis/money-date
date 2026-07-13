import { useState } from 'react'
import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { PageSkeleton } from '@/shared/components'
import { useBusinessActivity } from '@/features/business-activity/hooks/useBusinessActivity'
import { BusinessActivityDialog } from '@/features/business-activity/components/BusinessActivityDialog'
import { BusinessActivityTable } from '@/features/business-activity/components/BusinessActivityTable'
import { findLatestInSeries, isSeriesActive } from '@/features/business-activity/utils/recurrence'
import type { BusinessActivity } from '@/features/business-activity/types'

export function BusinessActivity() {
  const [addOpen, setAddOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<BusinessActivity | null>(null)
  const [duplicateSeed, setDuplicateSeed] = useState<Omit<BusinessActivity, 'id'> | null>(null)
  const { entries, addEntry, updateEntry, deleteEntry, confirmEntry, stopRepeating, loading } = useBusinessActivity()
  if (loading) return <PageSkeleton />

  function handleDuplicate(data: Omit<BusinessActivity, 'id'>) {
    setEditingEntry(null)
    setDuplicateSeed(data)
    setAddOpen(true)
  }

  const seriesActive = editingEntry?.seriesId ? isSeriesActive(entries, editingEntry.seriesId) : false

  function handleStopRepeating() {
    if (!editingEntry?.seriesId) return
    const latest = findLatestInSeries(entries, editingEntry.seriesId)
    if (latest) stopRepeating(latest.id)
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Biz Activity"
        description="Business transactions recorded through personal accounts — expenses and income to reconcile with Xero."
        buttonAction={() => { setDuplicateSeed(null); setAddOpen(true) }}
        buttonText="Add Entry"
      />

      <BusinessActivityTable entries={entries} onEdit={setEditingEntry} />

      {/* Add dialog */}
      <BusinessActivityDialog
        open={addOpen}
        onOpenChange={(open) => { setAddOpen(open); if (!open) setDuplicateSeed(null) }}
        onAdd={addEntry}
        initialData={duplicateSeed ?? undefined}
      />

      {/* Edit dialog */}
      <BusinessActivityDialog
        open={!!editingEntry}
        onOpenChange={(open) => { if (!open) setEditingEntry(null) }}
        onAdd={addEntry}
        onUpdate={updateEntry}
        onDelete={deleteEntry}
        onDuplicate={handleDuplicate}
        onStopRepeating={handleStopRepeating}
        onConfirm={confirmEntry}
        seriesActive={seriesActive}
        entry={editingEntry ?? undefined}
      />
    </PageContainer>
  )
}
