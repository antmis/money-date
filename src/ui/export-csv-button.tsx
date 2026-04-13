import { Download } from 'lucide-react'
import { Button } from './button'

export interface CsvColumn<T> {
  header: string
  accessor: (row: T) => string | number
}

interface ExportCSVButtonProps<T> {
  data: T[]
  columns: CsvColumn<T>[]
  filename?: string
}

function escapeCell(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function ExportCSVButton<T>({ data, columns, filename = 'export' }: ExportCSVButtonProps<T>) {
  function handleExport() {
    const date = new Date().toISOString().slice(0, 10)
    const headers = columns.map(c => escapeCell(c.header)).join(',')
    const rows = data.map(row =>
      columns.map(c => escapeCell(c.accessor(row))).join(',')
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}-${date}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download />
      Export CSV
    </Button>
  )
}
