// const axios = require('axios');

// async search() {
//     // Make a request for a user with a given ID
//     console.log(this.state.search_term)
    // const url = 'https://api.scryfall.com/cards/e9d5aee0-5963-41db-a22b-cfea40a967a3'
    // const data = await axios.get(url)
    //     .then(response => response.data)
    //     .catch(error => console.log(error));
    // this.setState({search_result: data})
    // directly below would also work
    // axios.get(url)
    //     .then(response => {
    //         this.setState({search_result : response.data})
    //     })
    //     .catch(error => console.log(error));
// }


// function Cardimage(props) {
//     if (props.card_ids.length > 0) {
//         console.log(props.card_ids)
//         return (
//             <ul id = "cardimagelist">
//                 {props.card_ids.map(id => <div>{Cardimagewrapper(id)}</div>)}
//             </ul>
//         )
//     } else {
//         return ( null )
//     }
// }