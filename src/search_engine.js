import React from 'react';
import ColorSelector from './color_selector';
import Searchterm from './search_searchterm';
import ColorFilter from './search_filter_color';
import RarityFilter from './search_filter_rarity';
import Selector from './box_selector';
import RangeSelector from './range_selector'
import { intersection_list } from './set_operators'

// TODO
// Oversized uit indices verwijderen? Verneuken de output...
// TODO
// card text index maken
// TODO
// only foils on/off

// TODO: naar simpele array...
const COLOR_FILTER_OPTIONS = ["OR", "MI", "MA", "EX"]
const TARGET_BUCKETS = ["keywords", "typeline", "cardname", "cardtext"]

// TODO: uit indexen halen?
const COLORS = ["W", "U", "B", "R", "G", "C"]
const RARITIES = ["common", "uncommon", "rare", "mythic"]

const image_folder = './images';

function Searchbutton(props) {
    return(
        <button
            className = "search-button"
            onClick={() => props.onClick()}
        >
            Search
        </button>
    )
  }

function Searchbar(props) {
    return(
        <input
            className = "search-bar"
            placeholder = {props.placeholder}
            onChange = {(event) => props.changeSearchterm(event.target.value)}
            onKeyPress = {(event) => {
                if (event.key === 'Enter') {
                    props.onKeyPress()
                }
            }}
        />
    )
}

function Imagepath(card_id) {
    return ( `${image_folder}/${card_id}.jpg` )
}

function Cardimagewrapper(card_id) {
    const full_image_path = Imagepath(card_id)
    console.log("returning image with card_id: " + card_id)
    return (
        <div>
            <img
                className="img-responsive"
                width="400px"
                src={full_image_path}
                alt = "yo"
            />
        </div>
    )
}

function Searchresult(data) {
    if (data != null) {
        console.log(data)
        return(
            <div>
                {JSON.stringify(data)}
                {Cardimagewrapper(`${data.set}_${data.cardnumber}`)}
            </div>
        )
    } else {
        return (null)
    }
}

// // todo:
// var search_args: {
//     search_term: "",
//     white: true,
//     blue: true,
//     black: true,
//     red: true,
//     green: true,
//     color_xor: false // whether search should be exact combination of colors (false) or whether card can include chosen colors (true)
//     cmc: 0,
//     cmc_type: 'minimal' // or maximal, or exact
//     card_type: 'all' // or any of the supertypes
//     etc
// }

// todo:
// pass start state, e.g. of colors properly

class Searchengine extends React.Component {
    constructor(props){
      super(props);
      var start_state = {
        search_term: "",
        color_filter_selection: "OR",
        cmc_filter: false,
        cmc_min: 0,
        cmc_max: 10000
      };
      // add colors
      COLORS.forEach((key) => {
        start_state[key] = true
      })
      // add rarities
      RARITIES.forEach((key) => {
        start_state[key] = true
      })
      // searchterm target buckets
      TARGET_BUCKETS.forEach((key) => {
        start_state[key] = true
      })
      this.state = start_state;
    }
   
    search() {
        // TODO:
        // verschillende zoekdingen in functies opdelen?

        // TODO:
        // search term opsplitsen op basis van spatie en intersecties/verenigingen uitvoeren op basis van termen
        
        // TODO:
        // boxen aan searchengine toevoegen om zoeken op deze zaken aan/uit te zetten

        // TODO:
        // alles tolower()?

        var searchtarget_state = {}
        TARGET_BUCKETS.forEach((target) => searchtarget_state[target] = this.state[target])
        console.log(searchtarget_state)

        const search_terms = this.state.search_term.toLowerCase().split(" ")
        console.log("Search terms array: ")
        console.log(search_terms)
        const searchterm_results = intersection_list(search_terms.map((search_term) => Searchterm(search_term, searchtarget_state)));

        // op dit niveau splitsen op spaties
        // lijst maken met resultaten
        // intersection gebruiken om searchterm_results te produceren
        // const searchterm_results = Searchterm(this.state.search_term, searchtarget_state) // NB: searchtarget_state is used for a union!
        console.log("Results through search: ")
        console.log(searchterm_results)


        // Color filter
        var color_state = {}
        COLORS.forEach((color_code) => color_state[color_code] = this.state[color_code])
        const color_filter = ColorFilter(color_state, 
            this.state.color_filter_selection)
        console.log("Color filter: ")
        console.log(color_filter)
        // Rarity filter
        var rarity_state = {}
        RARITIES.forEach((rarity) => rarity_state[rarity] = this.state[rarity])
        const rarity_filter = RarityFilter(rarity_state)
        console.log("Rarity filter: ")
        console.log(rarity_filter)

        // combine results from different search sets
        // var final_result = intersection(searchterm_results, color_filter)
        // final_result = intersection(final_result, rarity_filter)
        var final_result = intersection_list([searchterm_results, color_filter, rarity_filter])

        console.log("Search result: ")
        console.log(final_result)

        this.props.setSearchresult(
            Array.from(final_result))
    }
    
    getStatevalue(value_name) {
        const state_value = this.state[value_name]
        return state_value
    }

    toggleStatebool(state_name) {
        var new_state = {}
        new_state[state_name] = !this.state[state_name]
        this.setState(new_state,
            () => console.log("State " + state_name + " set to " + new_state[state_name]))
    }

    render() {
      return (
        <div className = "search-engine">
            <div className = "search-box">
                <Searchbar
                    placeholder = "Enter search term"
                    changeSearchterm = {(new_term) => this.setState({search_term : new_term})}
                    onKeyPress = {() => this.search()}
                />
                <Searchbutton
                    onClick = {() => this.search()}
                />
                <Selector
                    box_ids = {TARGET_BUCKETS}
                    getShowState = {(box_id) => this.getStatevalue(box_id)}
                    onChange = {(box_id) => this.toggleStatebool(box_id)}
                    selector_classname = "bucket-selector"
                    box_classname = "bucket-box"
                />
            </div>

            <ColorSelector
                colors = {COLORS}
                color_filter_options = {COLOR_FILTER_OPTIONS}
                getColorstate = {(color_code) => this.getStatevalue(color_code)}
                onColorChange = {(color_code) => this.toggleStatebool(color_code)}
                getSelectedFilter = {() => this.getStatevalue("color_filter_selection")}
                onFilterChange = {(filter_option) => this.setState(
                    {'color_filter_selection' : filter_option}, 
                    () => console.log("chosen color filter selection: " + filter_option))
                }
            />
            <Selector
                box_ids = {RARITIES}
                getShowState = {(box_id) => this.getStatevalue(box_id)}
                onChange = {(box_id) => this.toggleStatebool(box_id)}
                selector_classname = "rarity-selector"
                box_classname = "rarity-box"
            />
            <RangeSelector
                range_selector_classname = "numeric-selector"
                toggle_classname = 'numeric-toggle'
                isOn = {() => this.state["cmc_filter"]}
                toggleOn = {() => this.toggleStatebool("cmc_filter")}
                minValue = {() => this.state["cmc_min"]}
                maxValue = {() => this.state["cmc_max"]}
                onChangeMin = {(value) => this.setState({
                    cmc_min: value
                })}
                onChangeMax = {(value) =>  this.setState({
                    cmc_max: value
                })}
            />
            {Searchresult(this.state.search_result)}
        </div>
        )
    }  
}

export default Searchengine;