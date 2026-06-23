import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import RegisterPage from '@/app/(web)/register/page'

const fetchMock = vi.hoisted(() => {
  const mock = vi.fn()

  vi.stubGlobal('fetch', mock)

  return mock
})

vi.mock('next/navigation')
vi.mock('sonner')

const VALID_EMAIL = 'test@example.com'
const VALID_PASSWORD = 'Abcd123!'

const mockReplace = vi.fn()

const makeJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const renderPage = () => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={client}>
      <RegisterPage />
    </QueryClientProvider>,
  )
}

const getEmailInput = () => screen.getByLabelText(/email/i)
const getPasswordInput = () =>
  screen.getByLabelText(/password/i, { selector: 'input' })
const getSubmitButton = () =>
  screen.getByRole('button', { name: /creat.*account/i })
const getGoogleButton = () =>
  screen.getByRole('button', { name: /continue with google|redirecting/i })

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(useRouter).mockReturnValue({
    replace: mockReplace,
  } as unknown as ReturnType<typeof useRouter>)
  fetchMock.mockImplementation((url: RequestInfo | URL) => {
    const path = url.toString()

    if (path.includes('/sign-up/email')) {
      return Promise.resolve(
        makeJsonResponse({
          token: 'mock-token',
          user: {
            id: 'user-1',
            email: VALID_EMAIL,
            name: 'test',
            emailVerified: false,
          },
        }),
      )
    }

    if (path.includes('/sign-in/social')) {
      return Promise.resolve(
        makeJsonResponse({
          url: 'https://accounts.google.com/oauth2',
          redirect: true,
        }),
      )
    }

    return Promise.resolve(makeJsonResponse({}))
  })
})

describe('RegisterPage', () => {
  describe('Initial render', () => {
    test('it renders', () => {
      renderPage()
      expect(
        screen.getByRole('heading', { name: /create your account/i }),
      ).toBeInTheDocument()
      expect(getEmailInput()).toBeInTheDocument()
      expect(getPasswordInput()).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /create account/i }),
      ).toBeDisabled()
      expect(
        screen.getByRole('button', { name: /continue with google/i }),
      ).toBeInTheDocument()
      const link = screen.getByRole('link', { name: /sign in/i })

      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/login')
    })
  })

  describe('Successful registration', () => {
    test('it sends correct arguments to the registration endpoint', async () => {
      const user = userEvent.setup()

      renderPage()
      await user.type(getEmailInput(), VALID_EMAIL)
      await user.type(getPasswordInput(), VALID_PASSWORD)
      await user.click(getSubmitButton())
      await waitFor(() => {
        const call = fetchMock.mock.calls.find((args) =>
          String(args[0]).includes('/sign-up/email'),
        )

        expect(call).toBeDefined()
        expect(JSON.parse(call![1].body)).toMatchObject({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          name: 'test',
        })
      })
    })

    test('it shows success toast after registration', async () => {
      const toastSucces = vi.spyOn(toast, 'success')
      const user = userEvent.setup()

      renderPage()
      await user.type(getEmailInput(), VALID_EMAIL)
      await user.type(getPasswordInput(), VALID_PASSWORD)
      await user.click(getSubmitButton())
      await waitFor(() => {
        expect(toastSucces).toHaveBeenCalledWith('Registered successfully!')
      })
    })

    test('it redirects to /items after successful registration', async () => {
      const user = userEvent.setup()

      renderPage()
      await user.type(getEmailInput(), VALID_EMAIL)
      await user.type(getPasswordInput(), VALID_PASSWORD)
      await user.click(getSubmitButton())
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/items')
      })
    })
  })

  describe('Failed registration', () => {
    test('it shows error toast with the API error message', async () => {
      const toastError = vi.spyOn(toast, 'error')

      fetchMock.mockImplementationOnce(() =>
        Promise.resolve(
          makeJsonResponse({ message: 'Email already in use' }, 422),
        ),
      )
      const user = userEvent.setup()

      renderPage()
      await user.type(getEmailInput(), VALID_EMAIL)
      await user.type(getPasswordInput(), VALID_PASSWORD)
      await user.click(getSubmitButton())
      await waitFor(() => {
        expect(toastError).toHaveBeenCalledWith('Email already in use')
      })
    })

    test('it shows fallback error toast when the API returns no message', async () => {
      const toastError = vi.spyOn(toast, 'error')

      fetchMock.mockImplementationOnce(() =>
        Promise.resolve(makeJsonResponse({ code: 'UNKNOWN_ERROR' }, 500)),
      )
      const user = userEvent.setup()

      renderPage()
      await user.type(getEmailInput(), VALID_EMAIL)
      await user.type(getPasswordInput(), VALID_PASSWORD)
      await user.click(getSubmitButton())
      await waitFor(() => {
        expect(toastError).toHaveBeenCalledWith(
          'Registration failed. Please try again.',
        )
      })
    })
  })

  describe('Form pending state', () => {
    test('it shows "Creating account..." and disables the submit button while pending', async () => {
      let resolveFetch!: (r: Response) => void

      fetchMock.mockImplementationOnce(
        () =>
          new Promise<Response>((res) => {
            resolveFetch = res
          }),
      )
      const user = userEvent.setup()

      renderPage()
      await user.type(getEmailInput(), VALID_EMAIL)
      await user.type(getPasswordInput(), VALID_PASSWORD)
      await user.click(getSubmitButton())
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /creating account/i }),
        ).toBeDisabled()
      })
      resolveFetch(
        makeJsonResponse({ token: 'mock-token', user: { id: 'user-1' } }),
      )
    })
  })

  describe('Google sign-in', () => {
    test('it sends correct arguments to the social sign-in endpoint', async () => {
      const user = userEvent.setup()

      renderPage()
      await user.click(getGoogleButton())
      await waitFor(() => {
        const call = fetchMock.mock.calls.find((args) =>
          String(args[0]).includes('/sign-in/social'),
        )

        expect(call).toBeDefined()
        expect(JSON.parse(call![1].body)).toMatchObject({
          provider: 'google',
          callbackURL: '/items',
        })
      })
    })

    test('it shows "Redirecting..." and disables the Google button while pending', async () => {
      let resolveFetch!: (r: Response) => void

      fetchMock.mockImplementationOnce(
        () =>
          new Promise<Response>((res) => {
            resolveFetch = res
          }),
      )
      const user = userEvent.setup()

      renderPage()
      await user.click(getGoogleButton())
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /redirecting/i }),
        ).toBeDisabled()
      })
      resolveFetch(
        makeJsonResponse({
          url: 'https://accounts.google.com/oauth2',
          redirect: true,
        }),
      )
    })

    test('it returns the Google button to its normal state after the request resolves', async () => {
      const user = userEvent.setup()

      renderPage()
      await user.click(getGoogleButton())
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /continue with google/i }),
        ).toBeEnabled()
      })
    })
  })
})
