import React from 'react'
import AliceCarousel from '../lib/react-alice-carousel'

class App extends React.PureComponent {
  state = { mouseTrackingEnabled: true, preventEventOnTouchMove: false }
  responsive = {
    0: { items: 1 },
    600: { items: 2 },
    960: { items: 1 },
  }

  stagePadding = {
    paddingLeft: 30,
    paddingRight: 30,
  }

  render() {
    const { mouseTrackingEnabled, preventEventOnTouchMove } = this.state
    return (
      <div className="app" id="app">
        <h1 className="h1">React Alice Carousel</h1>
        <AliceCarousel
          showSlideInfo={true}
          preventEventOnTouchMove={preventEventOnTouchMove}
          mouseTrackingEnabled={mouseTrackingEnabled}
          fadeOutAnimation
          onSlideChanged={console.debug}
          responsive={this.responsive}
          duration={5000}
          infinite={true}
          // stagePadding={this.stagePadding}
        >
          <div className="item">
            <h1>1</h1>
          </div>
          <div className="item">
            <h1>2</h1>
          </div>
          <div className="item">
            <h1>3</h1>
          </div>
          <div className="item">
            <h1>4</h1>
          </div>
          <div className="item">
            <h1>5</h1>
          </div>
        </AliceCarousel>
        <div style={{ height: 1000 }} />
      </div>
    )
  }
}

export default App
