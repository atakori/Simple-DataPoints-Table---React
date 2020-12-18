import React from 'react';

const Header = (props) => {
    return (
            <div id="page-header" className={props.initialLoadingComplete? "show-visible-fade" : "hide-visible"}>
                {/* Image to go here */}
                <img src="" alt="Logo Here"/>
            </div>
    )
}
export default Header;