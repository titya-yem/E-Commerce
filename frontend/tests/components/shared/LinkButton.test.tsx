import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom' 
import LinkButton from '../../../src/components/shared/LinkButton'

describe('Link Button', () => {
  it('Should direct users to the given link and name when link is provided', () => {
    render(
      <MemoryRouter>
        <LinkButton link="shop" name="Shop Now" />
      </MemoryRouter>
    )

    const linkElement = screen.getByRole('link', { name: /Shop Now/i })
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute('href', '/shop')
  })
})
