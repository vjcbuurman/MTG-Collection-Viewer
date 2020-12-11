import React from 'react';

import Selector from './box_selector';

class ColorFilterOption extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            'open' : false
        }
    }

    toggleMenu() {
        this.setState({
            'open': !this.state.open
        })
    }

    handleOnClick(option) {
        this.toggleMenu()
        // this.setState({'selection': item.value})
        this.props.onChange(option)
    }

    render() {
        return (
            <div className="colorfilter-selector"
                onClick={() => this.toggleMenu()}
            >
            {this.props.getSelectedFilter()}
            {this.state.open && (
            <div className="colorfilter-choices">
                {this.props.color_filter_options.map(option => (
                    <button 
                        className="colorfilter-item" 
                        key = {option} 
                        onClick={() => this.handleOnClick(option)}
                    >
                        <span>{option}</span>
                    </button>
                ))}
            </div>
            )}
            </div>
        )
    }
}

class ColorSelector extends React.Component {

    show(color_code){
        return (
            this.props.getColorstate(color_code)
        )
    }

    render() {
        return (
            <span
                // TODO: onderstaande css...
                className = "color-selector"
            >
                <Selector
                    box_ids = {this.props.colors}
                    getShowState = {(box_id) => this.props.getColorstate(box_id)}
                    onChange = {(box_id) => this.props.onColorChange(box_id)}
                    box_classname = "color-box"
                />
                <ColorFilterOption
                    color_filter_options = {this.props.color_filter_options}
                    getSelectedFilter = {() => this.props.getSelectedFilter()}
                    onChange = {(filter_option) => this.props.onFilterChange(filter_option)}
                    className = "colorfilter-selector"
                />
            </span>
        )
    }

}


export default ColorSelector;