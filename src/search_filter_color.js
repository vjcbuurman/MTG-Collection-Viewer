import json_color_identity_index from './data/color_identity_index.json';
import { intersection_list, union_list, subtract } from './set_operators'

const color_identity_index = new Map()
Object.keys(json_color_identity_index).forEach((key) => {
    color_identity_index[key] = new Set(json_color_identity_index[key])
})

// Color filter
// Opties:
// OR: hit op 1 of meerdere kleuren 
// MI: minimaal alle gekozen kleuren, maar mogen meer zijn
// MA: ten hoogstens alle gekozen kleuren, maar mogen er minder zijn
// EX: exact de gekozen kleuren, niet meer, niet minder

function ColorFilter(selected_colors, color_filter_selection) {
    var selected_color_indices = []
    var unselected_color_indices = []
    // preparation
    Object.keys(selected_colors).forEach((color_code) => {
        selected_colors[color_code] ? selected_color_indices.push(color_identity_index[color_code]) : unselected_color_indices.push(color_identity_index[color_code])
    })
    // search logic
    var color_filter = new Set()
    if (color_filter_selection === "OR") {
        color_filter = union_list(selected_color_indices)
    } else if (color_filter_selection === "MI") {
        color_filter = intersection_list(selected_color_indices)
    } else if (color_filter_selection === "MA") {
        color_filter = subtract(
            union_list(selected_color_indices), 
            union_list(unselected_color_indices)
        )
    } else if (color_filter_selection === "EX") {
        color_filter = subtract(
            intersection_list(selected_color_indices), 
            union_list(unselected_color_indices)
        )
    }
    return ( color_filter )
}

export default ColorFilter