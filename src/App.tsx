import { useFetch } from "@/hooks/useFetch"
import { useState } from "react"

export const App = () => {
    const [page, setPage] = useState(1)
    const { data, loading, error } = useFetch<
        Array<{
            userId: number
            id: number
            title: string
            body: string
        }>
    >(`https://jsonplaceholder.typicode.com/posts?page=${page}`)

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error: {error.message}</p>
    }

    return (
        <main className="container mx-auto">
            <h1 className="text-center text-4xl">Template w2k</h1>
            <ul>
                {data?.map((post: any) => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setPage(page + 1)}
            >
                Load more
            </button>
        </main>
    )
}
