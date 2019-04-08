import React from 'react'
import AliceCarousel from '../lib/react-alice-carousel'

class App extends React.PureComponent {
  responsive = {
    0: { items: 2 },
    600: { items: 2 },
    960: { items: 3 }
  }

  stagePadding = {
    paddingLeft: 30,
    paddingRight: 30,
  }

  render() {
    return (
      <div className="app" id="app">
        <h1 className="h1">React Alice Carousel</h1>
        <AliceCarousel
          duration={3000}
          showSlideInfo={true}
          fadeOutAnimation={true}
          mouseDragEnabled={true}
          onSlideChanged={console.debug}
          infinite={false}
          autoHeight
          responsive={this.responsive}
          stagePadding={this.stagePadding}
        >
          <div className="item" style={{ height: 180 }}><h1>1</h1></div>
          <div className="item" style={{ height: 200 }}><h1>2</h1></div>
          <div className="item" style={{ height: 220 }}><h1>3</h1></div>
          <div className="item" style={{ height: 220 }}><h1>4</h1></div>
          <div className="item" style={{ height: 170 }}><h1>5</h1></div>
        </AliceCarousel>
      </div>
    )
  }
}

export default App
