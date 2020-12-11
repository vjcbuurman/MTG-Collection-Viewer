import React, { useState } from 'react';

// todo, change to class
function Dropdown({title, items, start_selection, changeSelection}) {
    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState(start_selection);
    const toggle = () => setOpen(!open);

    function handleOnClick(item) {
        toggle(!open);
        setSelection(item.value) // for showing user the chosen option
        // interesting:
        // changeSelection(selection) did not work consistently, maybe due to timing issues...
        changeSelection(item.value)
    }

    return (
        <div className="dropdown-menu"
            // tabIndex= {0}
            // className="dropdown-header"
            // role="button"
            onKeyPress={() => toggle(!open)}
            onClick={() => toggle(!open)}
        >
            {/* <div 
                tabIndex= {0}
                className="dropdown-header"
                role="button"
                onKeyPress={() => toggle(!open)}
                onClick={() => toggle(!open)}
            > */}
            {selection}    
            {open && (
                <div className="dropdown-choices" type = "listbox">
                    {items.map(item => (
                        <div className="dropdown-item" key={item.id}>
                            <button className="dropdown-item" type="button" onClick={() => handleOnClick(item)}>
                                <span>{item.value}</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
            </div>
        // </div>
    )
}

export default Dropdown;