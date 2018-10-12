import React from 'react'
import AliceCarousel from './react-alice-carousel'

const App = () => {
  const responsive = {
    0: { items: 1 },
    600: { items: 2 },
    960: { items: 3 }
  }

  const stagePadding = {
    paddingLeft: 50,
    paddingRight: 50,
  }

  return (
    <div className="app" id="app">
      <h1 className="h1">React Alice Carousel</h1>
      <AliceCarousel
        duration={400}
        showSlideInfo={true}
        fadeOutAnimation={true}
        mouseDragEnabled={true}
        responsive={responsive}
        stagePadding={stagePadding}
      >
        <div className="item"><h1>1</h1></div>
        <div className="item"><h1>2</h1></div>
        <div className="item"><h1>3</h1></div>
        <div className="item"><h1>4</h1></div>
        <div className="item"><h1>5</h1></div>

      </AliceCarousel>
    </div>
  )
}

export default App
