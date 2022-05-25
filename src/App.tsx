import React from 'react'
import InfiniteScroll from './useInfiniteScroll/InfiniteScroll'

// Upper level of InfiniteScroll component usage would be here
function App() {
    let items: any[] = []

    for(let i=1; i< 101; i++) {
        items.push(`Item ${i}`)
    }

    return (
        <>
            <p>Infinite scroll</p>
            <InfiniteScroll items={items}/>
        </>
    )
}

export default App