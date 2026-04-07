export function calcQuartersToGoal(
  targetAmount: number,
  currentAmount: number,
  quarterlyContribution: number
): number {
  if (quarterlyContribution <= 0) return Infinity
  const remaining = targetAmount - currentAmount
  if (remaining <= 0) return 0
  return Math.ceil(remaining / quarterlyContribution)
}

export function calcProgressPct(
  current: number,
  target: number
): number {
  if (target <= 0) return 0
  return Math.min(100, (current / target) * 100)
}
