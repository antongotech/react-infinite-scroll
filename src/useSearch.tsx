import React, {useEffect, useState} from 'react'
import axios from 'axios'

interface IResult {
    title: string
}

const UseSearch = (query: string, page: number) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [books, setBooks] = useState<string[]>([])
    const [hasMore, setHasMore] = useState<boolean>(false)

    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        setLoading(true)
        setError(false)

        let cancel: Function

        axios({
            method: 'GET',
            url: 'http://openlibrary.org/search.json',
            params: {q: query, page: page},
            cancelToken: new axios.CancelToken((c) => cancel = c)
        }).then((res) => {
            setBooks(prevState => [...prevState, ...res.data.docs.map((b: IResult) => b.title)])
            setHasMore(res.data.docs.length > 0)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })

        return () => cancel()
    }, [query, page])

    return {loading, error, books, hasMore}
}

export default UseSearch