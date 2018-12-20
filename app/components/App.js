import React from 'react'
import AliceCarousel from './react-alice-carousel'

class App extends React.PureComponent {
  responsive = {
    0: { items: 1 },
    600: { items: 2 },
    960: { items: 3 }
  }

  stagePadding = {
    paddingLeft: 50,
    paddingRight: 50,
  }

  render() {
    return (
      <div className="app" id="app">
        <h1 className="h1">React Alice Carousel</h1>
        <AliceCarousel
          showSlideInfo={true}
          fadeOutAnimation={true}
          mouseDragEnabled={true}
          responsive={this.responsive}
          stagePadding={this.stagePadding}
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
}

export default App
