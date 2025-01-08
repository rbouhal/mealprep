import React, { useEffect, useRef } from "react";
import "./Card.css";

function Card({ image, title, description }) {
  const cardRef = useRef();

  useEffect(() => {
    const currentCard = cardRef.current; // Copy cardRef.current to a local variable
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          currentCard.classList.add("visible");
        } else {
          currentCard.classList.remove("visible");
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the card is visible
      }
    );

    if (currentCard) {
      observer.observe(currentCard);
    }

    return () => {
      if (currentCard) observer.unobserve(currentCard); // Use the local variable here
    };
  }, []);

  return (
    <div ref={cardRef} className="card">
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
}

export default Card;
