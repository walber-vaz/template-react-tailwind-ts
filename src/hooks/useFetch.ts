import { useCallback, useEffect, useRef, useState } from 'react'

export interface FetchError {
    message: string
}

interface RetryProps {
    maxRetries?: number
}

export function useFetch<dataType, errorType = FetchError>(
    url: string,
): {
    data: dataType | null
    loading: boolean
    error: errorType | null
    retry: (props?: RetryProps) => void
    attemptsLeft: number
} {
    const [data, setData] = useState<dataType | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<errorType | null>(null)
    const controller = useRef<AbortController | null>(null)
    const [retryCount, setRetryCount] = useState(0)
    const [maxRetries, setMaxRetries] = useState(0)

    const fetchData = useCallback(async () => {
        controller.current?.abort()
        controller.current = new AbortController()

        try {
            setLoading(true)
            setError(null)
            const response = await fetch(url, {
                signal: controller.current.signal,
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            const result = (await response.json()) as dataType
            setData(result)
        } catch (error: unknown) {
            if ((error as Error).name !== 'AbortError') {
                setError({
                    message: (error as Error).message || 'An unknown error occurred',
                } as errorType)
            }
        } finally {
            setLoading(false)
        }
    }, [url])

    useEffect(() => {
        fetchData()

        return () => {
            controller.current?.abort()
        }
    }, [url, retryCount, fetchData])

    const retry = ({ maxRetries = 3 }: RetryProps = {}) => {
        if (retryCount < maxRetries) {
            setMaxRetries(maxRetries)
            setTimeout(() => {
                setRetryCount((prev) => prev + 1)
            }, 1000)
        } else {
            console.warn('Máximo de tentativas atingido.')
        }
    }

    return {
        data,
        loading,
        error,
        retry,
        attemptsLeft: maxRetries - retryCount,
    }
}
