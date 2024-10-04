import { useState, useEffect, useRef } from 'react'

export function useFetch<T>(url: string): {
    data: T | null
    loading: boolean
    error: any
} {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<{ message: string } | null>(null)

    const abortControllerRef = useRef<AbortController | null>(null)

    const fetchData = async () => {
        try {
            abortControllerRef.current = new AbortController()
            const response = await fetch(url, {
                signal: abortControllerRef.current.signal,
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            const result = (await response.json()) as T
            setData(result)
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.error('Request aborted')
                return
            }
            setError({
                message: error?.message || 'An unknown error occurred',
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [url])

    return { data, loading, error }
}
