import React from 'react'
import AliceCarousel from './react-alice-carousel'

class App extends React.PureComponent {
  responsive = {
    0: { items: 1 },
    600: { items: 2 },
    960: { items: 3 }
  }

  stagePadding = {
    paddingLeft: 100,
    paddingRight: 100,
  }

  render() {
    return (
      <div className="app" id="app">
        <h1 className="h1">React Alice Carousel</h1>
        <AliceCarousel
          duration={3000}
          showSlideInfo={true}
          autoHeigth={true}
          onInitialized={() => console.debug('IDD:')}
          fadeOutAnimation={true}
          mouseDragEnabled={true}
          responsive={this.responsive}
          //stagePadding={this.stagePadding}
        >
          <div className="item" style={{ height: 180 }}><h1>1</h1></div>
          <div className="item" style={{ height: 200 }}><h1>2</h1></div>
          <div className="item" style={{ height: 220 }}><h1>3</h1></div>
          <div className="item" style={{ height: 240 }}><h1>4</h1></div>
          <div className="item" style={{ height: 260 }}><h1>5</h1></div>
        </AliceCarousel>
      </div>
    )
  }
}

export default App
