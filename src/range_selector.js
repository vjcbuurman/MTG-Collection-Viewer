import React from 'react';
import NumericInput from 'react-numeric-input';

class RangeSelector extends React.Component {
        
    render() {
        return (
            <div
                className = {this.props.range_selector_classname}
            >
                <button
                    className = {this.props.toggle_classname}
                    onClick = {() => this.props.toggleOn()} // toggleBool is passed
                    style = {{color : this.props.isOn() ? 'black' : '#ccc'}}
                >
                    On
                </button>
                <NumericInput
                    className = "numeric-input"
                    value = {this.props.minValue()}
                    onChange = {(valueAsNumber) => this.props.onChangeMin(valueAsNumber)}
                />
                <NumericInput 
                    className = "numeric-input"
                    value = {this.props.maxValue()}
                    onChange = {(valueAsNumber) => this.props.onChangeMax(valueAsNumber)}
                />
            </div>
        )
    }

}

export default RangeSelector;