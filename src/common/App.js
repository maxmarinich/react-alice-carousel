import React from 'react'
import AliceCarousel from '../lib/react-alice-carousel'

class App extends React.PureComponent {
  carouselRef = React.createRef()
  state = { mouseTrackingEnabled: true, preventEventOnTouchMove: true }
  responsive = {
    0: { items: 1 },
    600: { items: 2 },
    960: { items: 3 },
  }

  render() {
    const { mouseTrackingEnabled, preventEventOnTouchMove, isRTL } = this.state
    return (
      <div className="app" id="app">
        <h1 className="h1">React Alice Carousel</h1>
        <AliceCarousel
          duration={250}
          showSlideInfo={true}
          preventEventOnTouchMove={preventEventOnTouchMove}
          mouseTrackingEnabled={mouseTrackingEnabled}
          onSlideChanged={console.debug}
          responsive={this.responsive}
          ref={this.carouselRef}
          isRTL={isRTL}
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

        <button type="button" onClick={this.slide} data-action="prev">
          prev
        </button>
        <button type="button" onClick={this.slide} data-action="next">
          next
        </button>
        <button type="button" onClick={this.toggleDirection}>
          {this.state.isRTL ? 'RTL' : 'LTR'}
        </button>
      </div>
    )
  }

  slide = ({ target }) => {
    const action = target.dataset.action

    if (action === 'next') {
      this.carouselRef.current.slideNext()
    } else if (action === 'prev') {
      this.carouselRef.current.slidePrev()
    }
  }

  toggleDirection = () => this.setState({ isRTL: !this.state.isRTL })
}

export default App
