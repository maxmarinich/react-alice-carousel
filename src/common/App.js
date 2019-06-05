import React from 'react'
import AliceCarousel from '../lib/react-alice-carousel'

class App extends React.PureComponent {
  responsive = {
    0: { items: 1 },
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
          duration={600}
          showSlideInfo={true}
          mouseDragEnabled={true}
          onSlideChanged={console.debug}
          infinite={false}
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
