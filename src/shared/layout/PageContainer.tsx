interface PageContainerProps {
  children: React.ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {children}
    </div>
  )
}
