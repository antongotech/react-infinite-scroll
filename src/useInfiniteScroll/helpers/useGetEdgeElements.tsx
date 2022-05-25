import React, {useEffect, useState} from 'react'

const useGetEdgeElements = (items: any[], itemsInFocus: any[]) => {
    const [isFloorElement, setIsFloorElement] = useState(false)
    const [isCeilingElement, setIsCeilingElement] = useState(false)

    // Checks if floor or ceiling element of the whole array is seen and blocks adding of new elements above the array's length
    useEffect(() => {
        if (itemsInFocus[0] === items[0]) {
            setIsFloorElement(true)
            return
        }
        if (itemsInFocus[itemsInFocus.length - 1] === items[items.length - 1]) {
            setIsCeilingElement(true)
            return
        }
        setIsFloorElement(false)
        setIsCeilingElement(false)
    }, [itemsInFocus])

    return {isFloorElement, isCeilingElement}
}

export default useGetEdgeElements