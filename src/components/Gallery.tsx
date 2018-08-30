import * as React from "react";
import AliceCarousel from "react-alice-carousel"
import "react-alice-carousel/lib/alice-carousel.css";

const Gallery = () => {
  const handleOnDragStart = (e:any) => e.preventDefault()
  return (
    <AliceCarousel mouseDragEnabled={true} duration={400}>
      <p onDragStart={handleOnDragStart}>1</p>
      <p onDragStart={handleOnDragStart}>2</p>
      <p onDragStart={handleOnDragStart}>3</p>
      <p onDragStart={handleOnDragStart}>4</p>
      <p onDragStart={handleOnDragStart}>5</p>
      <p onDragStart={handleOnDragStart}>6</p>
    </AliceCarousel>
  )
}

export default Gallery
