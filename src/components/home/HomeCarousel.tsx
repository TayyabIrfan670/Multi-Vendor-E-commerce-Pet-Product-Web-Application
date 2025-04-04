import React, { useState } from 'react';
import { Carousel, Button } from 'react-bootstrap';
import '../../assets/styles/home-carousel.css';

// Carousel data with updated images and correct filenames
const carouselItems = [
  {
    id: 1,
    image: `${process.env.PUBLIC_URL}/images/dog food carousel.jpeg`,
    title: 'Premium Dog Food',
    description: 'High-quality nutrition for your canine companions',
    buttonText: 'Shop Now',
    buttonLink: '/shop?category=Dogs'
  },
  {
    id: 2,
    image: `${process.env.PUBLIC_URL}/images/catfood carousel1.jpg`,
    title: 'Premium Cat Food',
    description: 'Delicious and nutritious meals for your feline friends',
    buttonText: 'Explore Collection',
    buttonLink: '/shop?category=Cats'
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/1200x400/6C757D/FFFFFF?text=Health+%26+Wellness',
    title: 'Pet Health & Wellness',
    description: 'Keep your pets healthy with our wellness products',
    buttonText: 'Learn More',
    buttonLink: '/shop?category=health'
  }
];

const HomeCarousel: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState<{[key: number]: boolean}>({});

  // Handle image load event
  const handleImageLoad = (id: number) => {
    setImageLoaded(prev => ({...prev, [id]: true}));
  };

  // Handle image error event
  const handleImageError = (id: number, image: string) => {
    console.log(`Failed to load carousel image ${id}:`, image);
    // Keep the current loaded state to prevent fluctuation
  };

  return (
    <Carousel className="home-carousel" interval={5000}>
      {carouselItems.map(item => (
        <Carousel.Item key={item.id}>
          <div className="carousel-image-container">
            <img
              className={`d-block w-100 carousel-image ${imageLoaded[item.id] ? 'loaded' : ''}`}
              src={item.image}
              alt={item.title}
              onLoad={() => handleImageLoad(item.id)}
              onError={() => handleImageError(item.id, item.image)}
            />
          </div>
          <Carousel.Caption>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <Button 
              variant="primary" 
              href={item.buttonLink}
              className="carousel-btn"
            >
              {item.buttonText}
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HomeCarousel; 