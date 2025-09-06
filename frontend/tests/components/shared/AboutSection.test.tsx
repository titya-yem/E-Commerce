import { render, screen } from '@testing-library/react'
import AboutSection from '../../../src/components/shared/AboutSection'
import { MemoryRouter } from 'react-router-dom'

describe('AboutSection', () => {
    it('should render text contents, image and buttoner', () => {
        render(<AboutSection />, { wrapper: MemoryRouter })

        expect(screen.getByRole('heading', { name: /about us/i })).toBeInTheDocument()
        
        const image = screen.getByAltText('about image') as HTMLImageElement
        expect(image).toBeInTheDocument()
        expect(image.src).toContain('About-image.png')

        expect(screen.getByRole('link', { name: /Explore Our Services/i })).toBeInTheDocument()
    })
})