import { PageContainer } from '@/components/layout/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { QuarterSummary } from '@/components/quarter/QuarterSummary'
import { Card, Field, Input, Label, Select } from '@/components/ui'
import { useRunway } from '@/hooks/useRunway'
import { useAllocations } from '@/hooks/useAllocations'
import { useGoals } from '@/hooks/useGoals'
import { calcPaymentAllocation } from '@/lib/calculations'
import type { Quarter as QuarterType } from '@/types'

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const

export function Quarter() {
  const {
    quarterData,
    setQuarter,
  } = useRunway()
  const { totalGoalsPerQ } = useGoals()
  const { rates } = useAllocations()

  const income = quarterData.incomeReceivedThisQ
  const breakdown = calcPaymentAllocation(income, rates, totalGoalsPerQ)

  return (
    <PageContainer>
      <SectionHeader
        title="Quarter"
        description="What landed this quarter and what can I distribute?"
      />

      <Card title="This Quarter">
        <Field>
          <Label>Quarter</Label>
          <Select
            value={quarterData.quarter}
            onValueChange={(val) => setQuarter({ quarter: val as QuarterType })}
            options={[...quarters]}
            className="w-24"
          />
        </Field>
        <Field>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            className="w-24"
            value={quarterData.year || ''}
            onChange={(e) =>
              setQuarter({ year: Number(e.target.value) || new Date().getFullYear() })
            }
          />
        </Field>

        <Field>
          <Label htmlFor="income">Income Received This Quarter</Label>
          <Input
            id="income"
            type="number"
            placeholder="0"
            value={quarterData.incomeReceivedThisQ || ''}
            onChange={(e) =>
              setQuarter({ incomeReceivedThisQ: Number(e.target.value) || 0 })
            }
          />
        </Field>
      </Card>

      <QuarterSummary income={income} breakdown={breakdown} />
    </PageContainer>
  )
}
