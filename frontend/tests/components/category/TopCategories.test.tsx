import { render, screen } from "@testing-library/react"
import TopCategories from "@/components/cateogry/TopCategories"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import axios from "axios"
import { vi, type Mocked } from "vitest"
import { Provider } from "react-redux"
import { store } from "@/store/store"

// --- mock axios ---
vi.mock("axios")
const mockedAxios = axios as Mocked<typeof axios>

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

describe("TopCategories", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: [] })
  })

  it("should render heading and PetFoodCategories component", async () => {
    const queryClient = createTestQueryClient()

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <TopCategories />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    )

    expect(await screen.findByText("Top Categories")).toBeInTheDocument()

    const images = await screen.findAllByAltText("Pet food categories")
    expect(images).toHaveLength(5)
  })
})
