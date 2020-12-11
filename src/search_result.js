import React from 'react';
import collection_info from './data/collection.json'
// import card_index from './data/card_index.json'
import cardid_to_name from './data/cardid_to_name.json'

const image_folder = './images';

const MAX_NUMBER_RESULTS = 100

function Imagepath(card_id) {
    return ( `${image_folder}/img_${card_id}.jpg` )
}

// TODO:
// https://stackoverflow.com/questions/14263594/how-to-show-text-on-image-when-hovering
// cardsize slider
// click to flip card (if possible?)
function Cardimagewrapper({card_id, card_info}) {
    // const [clicked, setClicked] = useState(false);

    const full_image_path = Imagepath(card_id)
    return (
        <div className = "card-image-wrapper">
            <img
                className = "card-image"
                // height = "300px"
                src = {full_image_path}
                alt = {card_id + " not available"}

            />
                {/* TODO:
                make below pretty...
                reactjs native solution instead of css solution
                possibly onClick, instead of onMouseover
                e.g. onClick show text thingy with cardimage as background? */}
            <div
                className="card-image-description"
            >
                <p>
                    Count: {card_info['count']}
                </p>
                <p>
                    Used: {card_info['used']}
                </p>
                <p>
                    Foil: {card_info['foil']}
                </p>
                <p>
                    Used (foil): {card_info['used (foil)']}
                </p>
                <p>
                    Used in: {card_info['used in'].join(", ")}
                </p>
                <p>
                    Used in (foil): {card_info['used (foil) in'].join(", ")}
                </p>
                {/* {JSON.stringify(card_info)} */}
                
            </div>
        </div>
    )
}




// TODO:
// add option to choose max number of results?
class Searchresult extends React.Component {
    render() {
        var result = this.props.search_result

        if (result.length === 0) {
            return (
                <div className = "search-result" >
                    Sorry, no results.
                </div>
            )
        } else {
            // sort results by cardname
            result.sort(function(a, b) {
                const name_a = cardid_to_name[a]
                const name_b = cardid_to_name[b]
                if (name_a < name_b) {
                    return -1
                } else if (name_a > name_b) {
                    return 1
                } else {
                    return 0
                }
            })
            return (
                <div className = "search-result">
                    <span>
                        {result.length > 100 && <div>
                            {"Showing only " + MAX_NUMBER_RESULTS + " results."}
                        </div>
                        }
                        {result.slice(0, MAX_NUMBER_RESULTS).map((card_id) => {
                            return (
                                <Cardimagewrapper
                                    key = {card_id}
                                    card_id = {card_id}
                                    card_info = {collection_info[card_id]}
                                />
                            )
                        })}
                    </span>
                </div>
            )
        }  
    }
}

export default Searchresult;