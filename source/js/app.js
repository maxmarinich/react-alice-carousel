import React from 'react';
import Carousel from './structure/Carousel';


export const App = () =>  (
    <div className="app">
        <h1 className="h1">React Carousel Gallery</h1>
        <Carousel>
            <div className="item">1</div>
            <div className="item">2</div>
            <div className="item">3</div>
            <div className="item">4</div>
        </Carousel>
    </div>
);
