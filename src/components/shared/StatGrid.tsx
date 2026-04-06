interface StatGridProps {
  children: React.ReactNode
}

export function StatGrid({ children }: StatGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {children}
    </div>
  )
}
