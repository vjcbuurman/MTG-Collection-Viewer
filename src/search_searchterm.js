import json_supertype_index from './data/supertype_index.json';
import json_subtype_index from './data/subtype_index.json';
import json_keyword_index from './data/keyword_index.json';
import json_name_index from './data/name_index.json';
import json_cardtext_index from './data/cardtext_index.json';
import json_set_index from './data/set_index.json';

import { union_list } from './set_operators';
import { get_value } from './util';
import cardid_to_name from './data/cardid_to_name.json';

const ALL_IDS = new Set(Object.keys(cardid_to_name))

// convert all json's into native Maps
const keyword_index = new Map()
Object.keys(json_keyword_index).forEach((key) => {
    keyword_index.set(key, new Set(json_keyword_index[key]))
})
const supertype_index = new Map()
Object.keys(json_supertype_index).forEach((key) => {
    supertype_index.set(key, new Set(json_supertype_index[key]))
})
const subtype_index = new Map()
Object.keys(json_subtype_index).forEach((key) => {
    subtype_index.set(key, new Set(json_subtype_index[key]))
})
const name_index = new Map()
Object.keys(json_name_index).forEach((key) => {
    name_index.set(key, new Set(json_name_index[key]))
})
const cardtext_index = new Map()
Object.keys(json_cardtext_index).forEach((key) => {
    cardtext_index.set(key, new Set(json_cardtext_index[key]))
})

const set_keys = new Set()
Object.keys(json_set_index).forEach((key) => {
    set_keys.add(key)
})
console.log(set_keys)

// TODO:
// set_keys.has() hieruit verwijderen en zorgen dat 
// setcodes uberhaupt niet deze functie in gaan
function Searchterm(search_term, searchtarget_state) {
    if (search_term === "" || set_keys.has(search_term)){
        return ( ALL_IDS )
    } else {
        return ( union_list([
                searchtarget_state["keywords"] ? get_value(keyword_index, search_term) : new Set(),
                searchtarget_state["typeline"] ? get_value(supertype_index, search_term) : new Set(),
                searchtarget_state["typeline"] ? get_value(subtype_index, search_term) : new Set(),
                searchtarget_state["cardname"] ? get_value(name_index, search_term) : new Set(),
                searchtarget_state["cardtext"] ? get_value(cardtext_index, search_term) : new Set(),
            ])
        )
    }
}

export default Searchterm;