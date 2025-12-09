import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Home.css';
import ep1 from '../assets/primary/ep1.jpg';
import ep2 from '../assets/primary/ep2.webp';
import q1 from '../assets/primary/q1.jpeg';
import q4 from '../assets/primary/q4.jpg';

const Home = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeTextIndex, setActiveTextIndex] = useState(null);
  const [cardImageIndices, setCardImageIndices] = useState([0, 0, 0, 0]);
  const [isAnimating, setIsAnimating] = useState([false, false, false, false]);
  
  const navigate = useNavigate();

  const handleReadMoreClick = (index, e) => {
    e.stopPropagation();
    if (activeTextIndex === index) {
      setActiveTextIndex(null);
    } else {
      setActiveTextIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setActiveTextIndex(null);
  };

  const cardImages = [
    [ep1, ep2, q1, q4],
    [ep2, q1, q4, ep1],
    [q1, q4, ep1, ep2],
    [q4, ep1, ep2, q1]
  ];

  useEffect(() => {
  const intervals = [];
  
  // Professional staggered intervals for each card
  const delays = [0, 2000, 4000, 6000]; // Stagger start times
  const intervalDuration = 8000; // 8 seconds between transitions
  
  for (let i = 0; i < 4; i++) {
    // Initial delay for staggered start
    setTimeout(() => {
      // Set up recurring interval
      const interval = setInterval(() => {
        // Start animation
        setIsAnimating(prev => {
          const newAnimating = [...prev];
          newAnimating[i] = true;
          return newAnimating;
        });
        
        // Change image at peak blur (50% of animation)
        setTimeout(() => {
          setCardImageIndices(prev => {
            const newIndices = [...prev];
            newIndices[i] = (newIndices[i] + 1) % cardImages[i].length;
            return newIndices;
          });
        }, 1000); // Change at 50% of 2s animation
        
        // Reset animation state after animation completes
        setTimeout(() => {
          setIsAnimating(prev => {
            const newAnimating = [...prev];
            newAnimating[i] = false;
            return newAnimating;
          });
        }, 2000); // Match animation duration (2s)
        
      }, intervalDuration);
      
      intervals.push(interval);
      
      // Trigger first animation immediately after delay
      setIsAnimating(prev => {
        const newAnimating = [...prev];
        newAnimating[i] = true;
        return newAnimating;
      });
      
      setTimeout(() => {
        setCardImageIndices(prev => {
          const newIndices = [...prev];
          newIndices[i] = (newIndices[i] + 1) % cardImages[i].length;
          return newIndices;
        });
      }, delays[i] + 1000);
      
      setTimeout(() => {
        setIsAnimating(prev => {
          const newAnimating = [...prev];
          newAnimating[i] = false;
          return newAnimating;
        });
      }, delays[i] + 2000);
      
    }, delays[i]);
  }
  
  return () => {
    intervals.forEach(interval => clearInterval(interval));
  };
}, []);


  const cards = [
    {
      id: 1,
      title: "Our",
      subtitle: "Precision",
      subtitle2: "Manufacturing",
      color: "#8FFF00",
      description: "Reference standards and flawed specimens. From ultrasonic testing to advanced radiography, we ensure your products meet the highest quality standards.",
    },
    {
      id: 2,
      title: "We",
      subtitle: "Analyze",
      subtitle2: "The Quality",
      subtitle3: "To Meets",
      subtitle4: "Standard",
      color: "#FF0066",
      description: "Standard and customised NDT reference block for every inspection model.",
    },
    {
      id: 3,
      title: "Specific",
      subtitle: "Applications and",
      subtitle2: "Customized",
      subtitle3: "Reference",
      subtitle4: "Standards",
      color: "#FF00FF",
      description: "Precious Assure - each reference block is certified through advanced inspection and traceability.",
    },
    {
      id: 4,
      title: "We",
      subtitle: "are",
      subtitle2: "NDT Experts",
      color: "#00FFFF",
      description: "Proven excellence through client experience.",
    },
  ];

  return (
    <div className="home-container">
      <div className="home-wrapper">
        <div className="cards-wrapper">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`card ${hoveredIndex === index ? 'expanded' : ''} ${
                hoveredIndex !== null && hoveredIndex !== index ? 'collapsed' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-image-wrapper">
                <img 
                  src={cardImages[index][cardImageIndices[index]]} 
                  alt={card.title} 
                  className={`card-image ${isAnimating[index] ? 'changing' : ''}`}
                />
                <div className="card-overlay"></div>
              </div>

              <div className="card-content">
                <h1 className="card-title" style={{ color: card.color }}>
                  {card.title}
                </h1>
                <h2 className="card-subtitle" style={{ color: card.color }}>
                  {card.subtitle}
                </h2>
                {card.subtitle2 && (
                  <h2 className="card-subtitle2" style={{ color: card.color }}>
                    {card.subtitle2}
                  </h2>
                )}
                {card.subtitle3 && (
                  <h2 className="card-subtitle3" style={{ color: card.color }}>
                    {card.subtitle3}
                  </h2>
                )}
                {card.subtitle4 && (
                  <h2 className="card-subtitle3" style={{ color: card.color }}>
                    {card.subtitle4}
                  </h2>
                )}

                {hoveredIndex === index && (
                  <div className="card-details">
                    <p className="card-description">{card.description}</p>
                    
                    <div className="card-buttons">
                      <button
                        className="card-button"
                        onClick={(e) => handleReadMoreClick(index, e)}
                        style={{ marginTop: '10px', cursor: 'pointer' }}
                      >
                        {activeTextIndex === index ? "Read Less" : "Read More"}
                      </button>
                    </div>

                    {activeTextIndex === index && (
                      <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#fff', fontStyle: 'italic' }}>
                        I did not change anything in mobile section
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;