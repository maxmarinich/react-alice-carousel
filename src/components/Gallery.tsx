import * as React from "react";
import AliceCarousel from "react-alice-carousel"
import "react-alice-carousel/lib/alice-carousel.css";

const Gallery = () => {
  const handleOnDragStart = (e:any) => e.preventDefault()
  return (
    <AliceCarousel mouseDragEnabled >
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
    </AliceCarousel>
  )
}

export default Gallery
