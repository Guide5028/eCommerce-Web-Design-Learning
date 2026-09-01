import { useState } from 'react';

// Custom carousel — NOT an AntD component. AntD's <Carousel> can only show one slide
// at a time; this design needs one big slide plus two smaller peeking slides, which
// AntD has no built-in way to do. Ported from legacy/js/app.js:365-418 (rotate-on-click).

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
  // `order` holds the rooms in current display order (first = the big slide).
  // `activeIndex` tracks which *original* room is currently first, for the dots.
  const [order, setOrder] = useState(ROOMS);
  const [activeIndex, setActiveIndex] = useState(0);

  function rotateTo(targetIndex) {
    const target = (targetIndex + ROOMS.length) % ROOMS.length;
    const targetRoom = ROOMS[target];
    const startAt = order.findIndex((room) => room === targetRoom);
    // rotate `order` so `targetRoom` becomes first
    setOrder((prev) => [...prev.slice(startAt), ...prev.slice(0, startAt)]);
    setActiveIndex(target);
  }

  return (
    <div className="room-carousel">
      <div className="room-carousel-viewport">
        <div className="room-carousel-track">
          {order.map((room) => (
            <div className="room-slide" key={room.title}>
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
          ))}
        </div>

        <button
          type="button"
          className="room-carousel-next"
          aria-label="Next room"
          onClick={() => rotateTo(activeIndex + 1)}
        >
          &gt;
        </button>

        <div className="room-carousel-dots">
          {ROOMS.map((room, i) => (
            <button
              key={room.title}
              type="button"
              className={`dot${i === activeIndex ? ' is-active' : ''}`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => rotateTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
