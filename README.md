
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
* `npx create-react-app mtg_collection_viewer`
* `python -m pip install stop_words`
* `python -m pip install pandas`
6. Navigate into the app folder using `cd mtg_collection_viewer`
1. Clone this repository into that folder using `git clone https://github.com/vjcbuurman/MTG-Collection-Viewer.git`

You now have all the necessary tools to make the database based on your own card collection.

### Resource creation

Make sure that the cards you own are inside the directory `collection_files`. Deck files are option and may be included in the folder `deck_files`. Collection files are `.csv`'s with the following three columns:

cardnumber  foil  cardname

The filename has to be a valid setcode. You can find these for each card on e.g. Scryfall. Note that the set Conspiracy (denoted by `con` should be given the name `set_con` since `con` is a reserved keyword on Windows).

foil is required, and may be left empty if you do not want to register whether cards are foil or not
you can either uniquely identify a card by it's name, or it's cardnumber. In most cases cardname is unique within a set, on the rare occasion it is not, the script below will tell you and require you to look up the cardnumber, e.g. through Scryfall.

Still using `cmd` navigated inside the `mtg_collection_viewer` folder:

1. `python collect_resources.py`: this will collect info from the Scryfall api and download cardimages for cards in your collection. Especially the latter may take a while.
1. `python build_indices.py`: to build the indices used by the app to filter cards.
1. `npm run build` to make a fast and stable build version of the app

### Running

Double click `run_build.bat`, which will open a window on your default browser and will start up the app!

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

May take a while due to the large set of resources (mainly due to images).

### `serve -s build`

Will serve the app at port 5000 (default).

```
npm install -g serve
serve -s build
serve -s build -l 4000
```

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
