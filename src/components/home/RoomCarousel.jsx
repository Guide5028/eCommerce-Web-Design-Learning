import { useRef } from 'react';
import { Carousel } from 'antd';

// Ported from legacy/js/app.js:365-418 (custom rotating carousel) using antd Carousel.

const ROOMS = [
  {
    image: '/images/room-bedroom.jpg',
    alt: 'Bedroom styled with a framed gallery wall and floor cushions',
    index: '01 — Bed Room',
    title: 'Inner Peace',
  },
  {
    image: '/images/room-dining.jpg',
    alt: 'Bright dining nook with wooden chairs and a wall clock',
    index: '02 — Dining Room',
    title: 'Warm Gathering',
  },
  {
    image: '/images/room-living.jpg',
    alt: 'Wooden dresser styled with a lamp and hanging vase',
    index: '03 — Living Room',
    title: 'Simple Living',
  },
];

export default function RoomCarousel() {
  const carouselRef = useRef(null);

  return (
    <div className="room-carousel">
      <div className="room-carousel-viewport">
        <Carousel ref={carouselRef}>
          {ROOMS.map((room) => (
            <div key={room.title}>
              <div className="room-slide">
                <img src={room.image} alt={room.alt} />
                <div className="room-caption-row">
                  <div className="room-caption">
                    <div className="room-caption-text">
                      <span className="room-caption-index">{room.index}</span>
                      <h3>{room.title}</h3>
                    </div>
                  </div>
                  <a
                    href="#top"
                    className="room-caption-arrow"
                    aria-label={`View ${room.title} inspiration`}
                    onClick={(e) => e.preventDefault()}
                  >
                    &rarr;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <button
          type="button"
          className="room-carousel-next"
          aria-label="Next room"
          onClick={() => carouselRef.current?.next()}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
