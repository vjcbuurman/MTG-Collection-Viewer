import React from 'react';

function SelectionBox({classname, text, onClick, shouldShow}){
    return (
        <button
            className={classname}
            onClick = {() => onClick(text)}
            style = {{color : shouldShow(text) ? 'black' : '#ccc'}}
        >
            {text}
        </button>
    )
}

class Selector extends React.Component {
    
    shouldShow(box_id){
        return (
            this.props.getShowState(box_id)
        )
    }
    
    makeSelectionBox(box_id) {
        return (
            <SelectionBox
                key = {box_id}
                classname = {this.props.box_classname}
                text = {box_id}
                onClick = {(box_id) => this.props.onChange(box_id)}
                shouldShow = {(box_id) => this.shouldShow(box_id)}
            />
        )
    }

    render() {
        return (
            <div
                className = {this.props.selector_classname}
            >
                {this.props.box_ids.map((box_id) => this.makeSelectionBox(box_id))}
            </div>
        )
    }

}

export default Selector;