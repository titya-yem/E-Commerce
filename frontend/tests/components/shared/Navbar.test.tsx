import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '@/components/shared/Navbar'
import cartReducer from '@/store/slices/Cart-Slice'
import authReducer from '@/store/slices/Auth-Slice'

// Create a mock Redux store
const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
  preloadedState: {
    cart: { items: [], totalPrice: 0, totalQuantity: 2, timestamp: Date.now() },
    auth: { isAuthenticated: false, user: null, loading: false },
  },
})

describe('Navbar', () => {
  it('renders nav links correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    )

    // Example: check if "Home" link exists
    expect(screen.getByText('Home')).toBeInTheDocument()
    
    // Example: check if cart badge shows the right quantity
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
