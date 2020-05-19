import React from 'react'
import AliceCarousel from '../lib/react-alice-carousel'

class App extends React.PureComponent {
  render() {
    return (
      <div className="app" id="app">
        <h1 className="h1">React Alice Carousel</h1>
        <AliceCarousel>
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
