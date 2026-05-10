import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

describe('Card', () => {
  it('renders card with children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText(/card content/i)).toBeInTheDocument()
  })

  it('renders default variant', () => {
    render(<Card variant="default">Default</Card>)
    const card = screen.getByText(/default/i)
    expect(card).toBeInTheDocument()
  })

  it('renders elevated variant', () => {
    render(<Card variant="elevated">Elevated</Card>)
    const card = screen.getByText(/elevated/i)
    expect(card).toBeInTheDocument()
  })

  it('renders with header', () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
      </Card>
    )
    expect(screen.getByText(/header/i)).toBeInTheDocument()
  })

  it('renders with title', () => {
    render(
      <Card>
        <CardTitle>Title</CardTitle>
      </Card>
    )
    expect(screen.getByText(/title/i)).toBeInTheDocument()
  })

  it('renders with content', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    )
    expect(screen.getByText(/content/i)).toBeInTheDocument()
  })
})