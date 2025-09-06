import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';

// Mock child components
vi.mock('@/components/HeroCat', () => ({ default: () => <div>HeroCat</div> }));
vi.mock('@/components/shared/AboutSection', () => ({ default: () => <div>AboutSection</div> }));
vi.mock('@/components/cateogry/TopCategories', () => ({ default: () => <div>TopCategories</div> }));
vi.mock('@/components/services/Services', () => ({ default: () => <div>Services</div> }));
vi.mock('@/components/Recommendation', () => ({ default: () => <div>Recommendation</div> }));
vi.mock('@/components/OurBrands', () => ({ default: () => <div>OurBrands</div> }));

// Mock image import
vi.mock('@/assets/image/hero-dog.png', () => ({ default: 'hero-dog.png' }));

describe('HomePage', () => {
  it('renders hero text and image', () => {
    render(<HomePage />, { wrapper: MemoryRouter });

    // Text check
    expect(
      screen.getByText(/we are always here for all your pet's good health/i)
    ).toBeInTheDocument();

    // Image check
    const image = screen.getByAltText('hero') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('hero-dog.png');

    // Button check
    expect(screen.getByRole("link", { name: /Shop Now/i})).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Schedule a Call/i})).toBeInTheDocument();
  });
});
