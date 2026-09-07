import { useState } from 'react';
import roomBedroom from '../assets/images/room-bedroom.jpg';
import roomDining from '../assets/images/room-dining.jpg';
import roomLiving from '../assets/images/room-living.jpg';
import styles from '../styles/components/RoomCarousel.module.css';

// Home page's "Room Inspiration" carousel: one big slide plus peeking side slides.

const ROOMS = [
  {
    image: roomBedroom,
    alt: 'Bedroom styled with a framed gallery wall and floor cushions',
    index: '01 — Bed Room',
    title: 'Inner Peace',
  },
  {
    image: roomDining,
    alt: 'Bright dining nook with wooden chairs and a wall clock',
    index: '02 — Dining Room',
    title: 'Warm Gathering',
  },
  {
    image: roomLiving,
    alt: 'Wooden dresser styled with a lamp and hanging vase',
    index: '03 — Living Room',
    title: 'Simple Living',
  },
];

export default function RoomCarousel() {
  const [order, setOrder] = useState(ROOMS); // current display order, first = big slide
  const [activeIndex, setActiveIndex] = useState(0);

  function rotateTo(targetIndex) {
    const target = (targetIndex + ROOMS.length) % ROOMS.length;
    const targetRoom = ROOMS[target];
    const startAt = order.findIndex((room) => room === targetRoom);
    setOrder((prev) => [...prev.slice(startAt), ...prev.slice(0, startAt)]);
    setActiveIndex(target);
  }

  return (
    <div className={styles.roomCarousel}>
      <div className={styles.roomCarouselViewport}>
        <div className={styles.roomCarouselTrack}>
          {order.map((room) => (
            <div className={styles.roomSlide} key={room.title}>
              <img src={room.image} alt={room.alt} />
              <div className={styles.roomCaptionRow}>
                <div className={styles.roomCaption}>
                  <div className={styles.roomCaptionText}>
                    <span className={styles.roomCaptionIndex}>{room.index}</span>
                    <h3>{room.title}</h3>
                  </div>
                </div>
                <a
                  href="#top"
                  className={styles.roomCaptionArrow}
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
          className={styles.roomCarouselNext}
          aria-label="Next room"
          onClick={() => rotateTo(activeIndex + 1)}
        >
          &gt;
        </button>

        <div className={styles.roomCarouselDots}>
          {ROOMS.map((room, i) => (
            <button
              key={room.title}
              type="button"
              className={`${styles.dot}${i === activeIndex ? ` ${styles.isActive}` : ''}`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => rotateTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
