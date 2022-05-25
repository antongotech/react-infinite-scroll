import React from 'react'
import InfiniteScroll from './useInfiniteScroll/InfiniteScroll'

// Upper level of InfiniteScroll component usage would be here
function App() {
    let items: any[] = []

    for(let i=1; i< 25; i++) {
        items.push(`Item ${i}`)
    }

    return (
        <>
            <h3 style={{textAlign: 'center'}}>Infinite scroll</h3>
            <InfiniteScroll items={items}/>
        </>
    )
}

export default App