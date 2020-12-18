import React from 'react';
import { LoaderDots } from '@thumbtack/thumbprint-react';

//Initial Loading Screen to be shown while Chronotope Data is initially complete
const LoadingScreen = (props) => {
    return(
        <div id="loading-screen-container" className={props.fadeClass}>
            <img id="loading-screen-img" src='' alt="Please wait..."/>
            <LoaderDots theme="inverse" />
        </div>
    )
}

export default LoadingScreen;