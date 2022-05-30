import React from 'react'
import InfiniteScroll from './InfiniteScroll/InfiniteScroll'

const Row: React.FC<{ index: number, style: any, ref?: HTMLInputElement }> = ({index, style}) => (
    <div style={style}>Row {index}</div>
)

function App() {

    return (
        <>
            <h3 style={{textAlign: 'center'}}>Infinite scroll</h3>
            <InfiniteScroll height={150} width={300} amount={50} Item={Row}/>
        </>
    )
}

export default App