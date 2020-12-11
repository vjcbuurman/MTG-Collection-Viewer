import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Searchengine from './search_engine';
import Searchresult from './search_result';


// todo:
// MtgApp will contain cardinfo index
// import card_index from './indices/card_index.json'
// Searchengine contains search indices
// Searchengine simply returns list of setcode_cardnumber combinations based on indices
// MtgApp will collect all info regarding the cards in that list
// Searchresults will just be showing results returned by searchengine

// FOR PRODUCTION BUILD:
// console.log = function() {}

// TODO:
// deck info toevoegen aan card info m.b.t count

// TODO:
// no search term: all cards

// TODO:
// search results: sorterings opties
// - naam
// - CMC
// - kleur/naam

class MtgApp extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      search_result : []
    }
  }

  setSearchresult(search_result){

    this.setState(
      {search_result: search_result},
      () => console.log("search result set")
    )
    
  }

  getSearchresult(){
    const cts = this.state.search_result
    return (cts)
  }

  render() {
    return (
      <span
        className="mtg-app"
      >
        <Searchengine 
          setSearchresult = {(search_result) => this.setSearchresult(search_result)}
        />
        <Searchresult 
          search_result = {this.getSearchresult()}
        />
      </span>
    );
  }
}

// ========================================

ReactDOM.render(
  <MtgApp />,
  document.getElementById('root')
);
