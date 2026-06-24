'use client'

import { type FC, useEffect } from 'react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

const GlobalError: FC<Props> = ({ error, reset }) => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center font-sans">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-gray-500">
          A critical error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          Try again
        </button>
      </body>
    </html>
  )
}

export default GlobalError
