import React, {CSSProperties} from 'react'
import InfiniteScroll from './InfiniteScroll/InfiniteScroll'

interface IRow {
    index: number
    style: React.CSSProperties | undefined
}

const Row: React.FC<IRow> = ({index, style}) => {
    const overridenStyles: CSSProperties = {...style, textAlign: 'center', lineHeight: '80px'}
    return (
        <div style={overridenStyles}>Row {index}</div>
    )
}

function App() {

    return (
        <>
            <h3 style={{textAlign: 'center'}}>Infinite scroll</h3>
            <InfiniteScroll height={550} width='100%' amount={100} Item={Row} rendered={10} inFocus={7}/>
        </>
    )
}

export default App