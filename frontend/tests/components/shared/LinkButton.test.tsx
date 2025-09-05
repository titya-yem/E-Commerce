import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import LinkButton from '../../../src/components/shared/LinkButton'

describe('LinkButton', () => {
  it('LinkButton component navigates on click', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LinkButton link="shop" name="Shop Now" />} />
          <Route path="/shop" element={<div>Shop Page</div>} />
        </Routes>
      </MemoryRouter>
    )

    // Find the link/button
    const buttonLink = screen.getByRole('link', { name: /Shop Now/i })
    expect(buttonLink).toHaveAttribute('href', '/shop')

    // Simulate user click
    await user.click(buttonLink)

    // Assert that the route changed and the new page is displayed
    expect(screen.getByText('Shop Page')).toBeInTheDocument()
  })
})
