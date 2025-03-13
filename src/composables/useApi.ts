import { ref } from 'vue'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface ApiOptions {
  url: string
  method?: HttpMethod
  headers?: Record<string, string>
  body?: any
}

export function useApi() {
  const data = ref<any>(null)
  const error = ref<any>(null)
  const loading = ref<boolean>(false)
  const status = ref<number | null>(null)

  const fetchData = async (options: ApiOptions) => {
    loading.value = true
    error.value = null
    data.value = null
    status.value = null

    try {
      const response = await fetch(options.url, {
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body ? JSON.stringify(options.body) : undefined
      })

      status.value = response.status

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw { status: response.status, ...errorData }
      }

      data.value = await response.json().catch(() => null)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    error,
    loading,
    status,
    fetchData
  }
}