import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => children,
  },
}))

describe('Home Page', () => {
  it('renders the home page', () => {
    render(<Home />)
    expect(screen.getByText('ERP Santinos')).toBeInTheDocument()
  })

  it('displays API status section', () => {
    render(<Home />)
    const apiSection = screen.getByText(/Connecting to API|API Connected Successfully|Error connecting to API/)
    expect(apiSection).toBeInTheDocument()
  })

  it('renders documentation links', () => {
    render(<Home />)
    expect(screen.getByRole('link', { name: /Documentation/i })).toBeInTheDocument()
  })
})
