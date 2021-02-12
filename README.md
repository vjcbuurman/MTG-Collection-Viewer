
# Intro

## Todo

* pagineren van resultaten -> stap 1, simpelweg max X resultaten tonen
* constant updaten van zoekresultaten?
* responsive viewer -> soort van af
* indices maken
* zoekfunctionaliteit maken
* geen images voor signed versies van kaarten

## Instructions

* You need Python and some packages: used to build the 'database' that is used by the react app
* You need NPM and some packages: used to build and serve the app itself

### Installation

(on Windows 10)

1. Install:
* Node & NPM (https://www.npmjs.com/get-npm)
* Python (https://www.python.org/downloads/)
* Git (https://git-scm.com/downloads)
2. Navigate in explorer to the folder where you would like to 'install' the app
1. Type `cmd` in the folder path and press `enter` to open the command prompt
1. Perform the following command prompt instructions to install the necessary elements of NPM & Python and create the skeleton for the app
* `npm install create-react-app`
* `npm install react-numeric-input --save`
* `npm install -g serve`
* `npx create-react-app mtg_collection_viewer`
* `python -m pip install stop_words`
* `python -m pip install pandas`
6. Navigate into the app folder using `cd mtg_collection_viewer`
1. Clone this repository into that folder using `git clone https://github.com/vjcbuurman/MTG-Collection-Viewer.git`

You now have all the necessary tools to make the database based on your own card collection, build and run the app.

### Resource creation

Make sure that the cards you own are inside the directory `collection_files`. Deck files are option and may be included in the folder `deck_files`. Collection files are `.csv`'s with the following three columns:

cardnumber  foil  cardname

The filename has to be a valid shortcode for a set, for example War of the Sparks' setcode is 'war'. You can find these setcodes for each card on the card itself, or for older cards on e.g. Scryfall. Note that cards entered for the set Conspiracy (denoted by `con`) should be in a file given the name `set_con` since `con` is a reserved keyword on Windows.

'foil' is required as a column but may be left empty if you do not want to register whether cards are foil or not
you can either uniquely identify a card by it's name, or it's cardnumber. In most cases cardname is unique within a set, on the rare occasion it is not, the script below will tell you and require you to look up the cardnumber, e.g. through Scryfall.

Still using `cmd` navigated inside the `mtg_collection_viewer` folder:

1. `python collect_resources.py`: this will collect info from the Scryfall api and download cardimages for cards in your collection. Especially the latter may take a while.
1. `python build_indices.py`: to build the indices used by the app to filter cards.
1. `npm run build` to make a fast and stable build version of the app. Note: this may take a while since it will copy over many resources such as card images to a place where the app-build will be able to find it.

### Running

Double click `run_build.bat`, which will open a window on your default browser and will start up the app!
