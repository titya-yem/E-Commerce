import { render, screen } from '@testing-library/react'
import ServicesPage from '@/pages/ServicePage'
import { MemoryRouter } from 'react-router-dom'

describe('ServicesPage', () => {
    it('should render heading, image and button', () => {
        render(<ServicesPage />, { wrapper: MemoryRouter })

        expect(screen.getByRole('heading', { name: "Love is a for- legs words" })).toBeInTheDocument()
        expect(screen.getByAltText('Smiling dog and cat sitting together')).toBeInTheDocument()
        expect(screen.getByRole("link", { name: /Book Appointment/i })).toHaveAttribute("href", "/appointment")
        expect(screen.getByRole("link", { name: /Schedule your appointment Today/i })).toHaveAttribute("href", "/appointment")        
    })
})