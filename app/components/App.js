import React from 'react'
import AliceCarousel from './react-alice-carousel'

const App = () => {
  const responsive = {
    0: { items: 1 },
    700: { items: 2 },
    960: { items: 1 }
  }

  return (
    <div className="app">
      <h1 className="h1">React Alice Carousel</h1>
      <AliceCarousel
        duration={400}
        responsive={responsive}
        fadeOutAnimation={true}
        mouseDragEnabled={true}
      >
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
      </AliceCarousel>
    </div>
  )
}

export default App
