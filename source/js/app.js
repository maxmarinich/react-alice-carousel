import React from 'react';
import Carousel from './structure/Carousel';


export const App = () =>  (
    <div className="app">
        <h1 className="h1">React Carousel Gallery</h1>
        <Carousel >
            <div className="item"><h1>1</h1></div>
            <div className="item"><h1>2</h1></div>
            <div className="item"><h1>3</h1></div>
            <div className="item"><h1>4</h1></div>
            <div className="item"><h1>5</h1></div>
            <div className="item"><h1>6</h1></div>
            <div className="item"><h1>7</h1></div>
            <div className="item"><h1>8</h1></div>
            <div className="item"><h1>9</h1></div>
            <div className="item"><h1>10</h1></div>
            <div className="item"><h1>11</h1></div>
        </Carousel>
    </div>
);
