import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { QuarterSummary } from '@/features/quarter'
import { useRunway } from '@/features/runway'
import { useAllocations, calcPaymentAllocation } from '@/features/allocate'
import { useGoals } from '@/features/goals'
import { Card, Field, Input, Label, Select, XStack, YStack } from '@/ui'
import type { Quarter as QuarterType } from '@/shared/types'

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
        <YStack className="w-72" gap={2}>
          <XStack gap={4}>
            <Field className="flex-1">
              <Label>Quarter</Label>
              <Select
                value={quarterData.quarter}
                onValueChange={(val) => setQuarter({ quarter: val as QuarterType })}
                options={[...quarters]}
              />
            </Field>
            <Field className="flex-1">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={quarterData.year || ''}
                onChange={(e) =>
                  setQuarter({ year: Number(e.target.value) || new Date().getFullYear() })
                }
              />
            </Field>
          </XStack>

          <Field className="flex-1">
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
        </YStack>
      </Card>

      <QuarterSummary income={income} breakdown={breakdown} />
    </PageContainer>
  )
}
