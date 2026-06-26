export const http = {
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
    const query = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.set(key, String(value))
        }
      })
    }

    const res = await fetch(`${url}?${query.toString()}`)

    if (!res.ok) {
      throw new Error('Request failed')
    }

    return res.json()
  },

  post: async <T>(url: string, body?: unknown): Promise<T> => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error('Request failed')
    }

    return res.json()
  },

  delete: async <T>(
    url: string,
    params?: Record<string, unknown>,
  ): Promise<T> => {
    const query = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.set(key, String(value))
        }
      })
    }

    const fullUrl = query.toString() ? `${url}?${query.toString()}` : url

    const res = await fetch(fullUrl, {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error('Request failed')
    }

    return res.json().catch(() => undefined as T)
  },
}
