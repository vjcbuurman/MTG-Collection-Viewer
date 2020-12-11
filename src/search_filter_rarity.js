import json_rarity_index from './data/rarity_index.json';

const rarity_index = new Map()
Object.keys(json_rarity_index).forEach((key) => {
    rarity_index[key] = new Set(json_rarity_index[key])
})

// nadeel is nu enkel dat search_engine (die gebruik maakt van deze code) technisch gezien moet weten welke rarities in index zitten, zonder die index te kennen.
function RarityFilter(selected_rarities) {
    var rarity_filter = new Set()
    // add, for each rarity, if rarity is selected, all items in that index
    Object.keys(selected_rarities).forEach((rarity) => {
        if (selected_rarities[rarity]) rarity_index[rarity].forEach(rarity_filter.add, rarity_filter)
    })
    return ( rarity_filter )
}

export default RarityFilter