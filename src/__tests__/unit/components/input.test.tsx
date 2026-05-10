import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Input label="Username" />)
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
  })

  it('renders with error message', () => {
    render(<Input error="Vui lòng nhập giá trị" />)
    expect(screen.getByText(/vui lòng nhập giá trị/i)).toBeInTheDocument()
  })

  it('handles input change', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test value')

    expect(handleChange).toHaveBeenCalled()
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Nhập giá trị..." />)
    expect(screen.getByPlaceholderText(/nhập giá trị/i)).toBeInTheDocument()
  })

  it('renders with default value', () => {
    render(<Input defaultValue="Giá trị mặc định" />)
    expect(screen.getByDisplayValue(/giá trị mặc định/i)).toBeInTheDocument()
  })

  it('renders disabled input', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('associates label with input', () => {
    render(<Input label="Email" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id')
  })
})