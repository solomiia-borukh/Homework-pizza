import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { RegisterFormComponent } from '@/app/modules/sign/register-form'

vi.mock('next/navigation')
vi.mock('@/pkg/auth/auth-client')
vi.mock('sonner')

const VALID_EMAIL = 'test@example.com'
const VALID_PASSWORD = 'Abcd123!'

const PASSWORD_ERRORS = [
  'Password is required!',
  'Password should have at least 8 characters!',
  'Password must contain at least one uppercase letter!',
  'Password must contain at least one lowercase letter!',
  'Password must contain at least one number!',
  'Password must contain at least one special character!',
]

const renderForm = () => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={client}>
      <RegisterFormComponent />
    </QueryClientProvider>,
  )
}

const getEmailInput = () => screen.getByLabelText(/email/i)
const getPasswordInput = () =>
  screen.getByLabelText(/password/i, { selector: 'input' })
const getSubmitButton = () =>
  screen.getByRole('button', { name: /creat.*account/i })

beforeEach(() => {
  vi.mocked(useRouter).mockReturnValue({
    replace: vi.fn(),
  } as unknown as ReturnType<typeof useRouter>)
})

describe('RegisterForm', () => {
  describe('Submit button disabled state', () => {
    test('it is disabled when both fields are empty', () => {
      renderForm()
      expect(getSubmitButton()).toBeDisabled()
    })

    test('it is disabled when only email is filled', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getEmailInput(), VALID_EMAIL)
      expect(getSubmitButton()).toBeDisabled()
    })

    test('it is disabled when only password is filled', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getPasswordInput(), VALID_PASSWORD)
      expect(getSubmitButton()).toBeDisabled()
    })

    test('it is disabled with invalid email and valid password', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getEmailInput(), 'notanemail')
      await user.type(getPasswordInput(), VALID_PASSWORD)
      expect(getSubmitButton()).toBeDisabled()
    })

    test('it is disabled with valid email and invalid password', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getEmailInput(), VALID_EMAIL)
      await user.type(getPasswordInput(), 'weak')
      expect(getSubmitButton()).toBeDisabled()
    })

    test('it is enabled when both email and password are valid', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getEmailInput(), VALID_EMAIL)
      await user.type(getPasswordInput(), VALID_PASSWORD)
      expect(getSubmitButton()).toBeEnabled()
    })

    test('it becomes disabled immediately when valid email is cleared', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getEmailInput(), VALID_EMAIL)
      await user.type(getPasswordInput(), VALID_PASSWORD)
      expect(getSubmitButton()).toBeEnabled()
      await user.clear(getEmailInput())
      expect(getSubmitButton()).toBeDisabled()
    })
  })

  describe('Email validation (onBlur)', () => {
    test('it shows required error when email is empty and blurred', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.click(getEmailInput())
      await user.tab()
      expect(screen.getByText('Email is required!')).toBeInTheDocument()
    })

    test('it shows invalid email error for input without @', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getEmailInput(), 'notanemail')
      await user.tab()
      expect(screen.getByText('Invalid email address!')).toBeInTheDocument()
    })

    test('it shows invalid email error when only the domain part is provided', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getEmailInput(), '@nodomain')
      await user.tab()
      expect(screen.getByText('Invalid email address!')).toBeInTheDocument()
    })

    test('it shows no error for a valid email after blur', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getEmailInput(), VALID_EMAIL)
      await user.tab()
      expect(screen.queryByText('Email is required!')).not.toBeInTheDocument()
      expect(
        screen.queryByText('Invalid email address!'),
      ).not.toBeInTheDocument()
    })
  })

  describe('Password validation (onBlur)', () => {
    test('it shows min-length error when password is cleared after typing', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getPasswordInput(), 'x')
      await user.clear(getPasswordInput())
      await user.tab()
      expect(
        screen.getByText('Password should have at least 8 characters!'),
      ).toBeInTheDocument()
    })

    test('it shows error for password shorter than 8 characters', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getPasswordInput(), 'Abc1!')
      await user.tab()
      expect(
        screen.getByText('Password should have at least 8 characters!'),
      ).toBeInTheDocument()
    })

    test('it shows error when password has no uppercase letter', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getPasswordInput(), 'abcd1234!')
      await user.tab()
      expect(
        screen.getByText(
          'Password must contain at least one uppercase letter!',
        ),
      ).toBeInTheDocument()
    })

    test('it shows error when password has no lowercase letter', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getPasswordInput(), 'ABCD1234!')
      await user.tab()
      expect(
        screen.getByText(
          'Password must contain at least one lowercase letter!',
        ),
      ).toBeInTheDocument()
    })

    test('it shows error when password has no number', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getPasswordInput(), 'Abcdefgh!')
      await user.tab()
      expect(
        screen.getByText('Password must contain at least one number!'),
      ).toBeInTheDocument()
    })

    test('it shows error when password has no special character', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getPasswordInput(), 'Abcd1234')
      await user.tab()
      expect(
        screen.getByText(
          'Password must contain at least one special character!',
        ),
      ).toBeInTheDocument()
    })

    test('it shows no error for a valid password after blur', async () => {
      const user = userEvent.setup()

      renderForm()
      await user.type(getPasswordInput(), VALID_PASSWORD)
      await user.tab()
      for (const msg of PASSWORD_ERRORS) {
        expect(screen.queryByText(msg)).not.toBeInTheDocument()
      }
    })
  })
})
