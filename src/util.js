export function get_value(index, key){
    console.log("looking in index for key")
    console.log(index.has(key))
    if (index.has(key)) {
        return index.get(key)
    } else {
        return new Set()
    }
}