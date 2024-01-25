import React, { useState } from 'react';
import '../Styles/Gallery.css';
const ImageGallery = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  if (!images || images.length === 0) {
    return null; // If no images, render nothing
  }
  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="image-gallery">
      <img
        src={`http://wddgaaiyqdiexmerxnue.supabase.co/storage/v1/object/public/products_images/${images[currentImage]}`}
        alt={`Image ${currentImage + 1}`}
      />

      <div className="gallery-controls">
        <button onClick={handlePrev}>&lt;</button>
        <button onClick={handleNext}>&gt;</button>
      </div>
    </div>
  );
};

export default ImageGallery;
