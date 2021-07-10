// TODO
// Compile warning wegnemen

// directly taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

export function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

export function union_list(sets) {
    let _union = new Set()
    for (let set of sets) {
        for (let elem of set) {
            _union.add(elem)
        }
    }
    return _union
}

export function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

export function intersection_list(sets) {
    console.log("Entering intersection with sets: ")
    console.log(sets)
    if (sets.length === 0) {
        return new Set()
    } else if (sets.length === 1) {
        return sets[0]
    } else if (sets.length === 2){
        return intersection(sets[0], sets[1])
    } else {
        return intersection(sets[0], intersection_list(sets.slice(1)))
    }
}

// returns A - B or all elements in A that are not in B
export function subtract(A, B) {
    let subtracted_A = new Set(A)
    for (let elem of B) {
        subtracted_A.delete(elem)
    }
    return subtracted_A
}

// mozilla code:
// function difference(setA, setB) {
//     let _difference = new Set(setA)
//     for (let elem of setB) {
//         _difference.delete(elem)
//     }
//     return _difference
// }