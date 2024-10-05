import { useEffect, useRef, useState } from 'react'

import { type FetchError, useFetch } from '@/hooks/useFetch'

interface Post {
    userId: number
    id: number
    title: string
    body: string
}

export const App = () => {
    const [page, setPage] = useState(1)
    const { data, loading, error, retry, attemptsLeft } = useFetch<Post[], FetchError>(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=5`,
        // 'https://httpbin.org/status/500',
    )
    const dialogRef = useRef<HTMLDialogElement | null>(null)

    useEffect(() => {
        if (error) {
            dialogRef.current?.showModal()
        } else {
            dialogRef.current?.close()
        }
    }, [error])

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 && !error) {
            dialogRef.current?.showModal()
            return
        }

        setPage(newPage)
    }

    const handleCloseDialog = () => {
        dialogRef.current?.close()
    }

    const handleRetry = () => {
        retry()
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-lg font-semibold text-gray-600">Loading...</p>
            </div>
        )
    }

    return (
        <main className="container mx-auto">
            <h1 className="mb-4 text-center text-4xl font-bold">Template w2k</h1>
            {data && (
                <ul className="list-disc pl-5">
                    {data.map((post: Post) => (
                        <li key={post.id} className="mb-2">
                            <h2 className="text-lg font-bold">{post.title}</h2>
                            <p className="text-gray-600">{post.body}</p>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-6 flex justify-center space-x-4">
                <button
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous page
                </button>
                <button
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next page
                </button>
            </div>

            <dialog ref={dialogRef} className="rounded-lg border-2 border-gray-400 p-4">
                {error ? (
                    <>
                        <p className="text-red-500">Error: {error.message}</p>
                        <button
                            className={`mt-4 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 ${attemptsLeft === 0 ? 'cursor-not-allowed' : 'cursor-pointer'} `}
                            onClick={handleRetry}
                        >
                            Retry ({attemptsLeft} attempts left)
                        </button>
                    </>
                ) : (
                    <>
                        <p>Page number must be greater than 0</p>
                        <button
                            className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                            onClick={handleCloseDialog}
                        >
                            OK
                        </button>
                    </>
                )}
            </dialog>
        </main>
    )
}
