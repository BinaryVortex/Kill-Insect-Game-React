import React, { useState, useRef, useEffect } from "react";
import "./CatchTheInsect.scss";

const INSECTS = [
  {
    name: "Fly",
    img: "https://pngimg.com/uploads/fly/fly_PNG3945.png"
  },
  {
    name: "Mosquito",
    img: "https://pngimg.com/uploads/mosquito/mosquito_PNG18149.png"
  },
  {
    name: "Bee",
    img: "https://pngimg.com/uploads/bee/bee_PNG6.png"
  }
];

function pad(num) {
  return num < 10 ? "0" + num : num;
}

export default function CatchTheInsect() {
  // Screens: 0 = start, 1 = choose insect, 2 = game
  const [screen, setScreen] = useState(0);
  const [selectedInsect, setSelectedInsect] = useState(null);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [insects, setInsects] = useState([]);
  const [showMsg, setShowMsg] = useState(false);
  const timerRef = useRef();

  // Timer effect
  useEffect(() => {
    if (screen === 2) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
      setScore(0);
      setSeconds(0);
      setShowMsg(false);
      setInsects([]);
      setTimeout(() => createInsect(), 1000);
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [screen, selectedInsect]);

  // Format time
  function formatTime() {
    const m = pad(Math.floor(seconds / 60));
    const s = pad(seconds % 60);
    return `Time: ${m}:${s}`;
  }

  function getRandomLocation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = Math.random() * (width - 200) + 100;
    const y = Math.random() * (height - 200) + 100;
    return { x, y };
  }

  // Create insect at random position
  function createInsect() {
    if (!selectedInsect) return;
    const { x, y } = getRandomLocation();
    setInsects(insects => [
      ...insects,
      {
        id: Math.random().toString(36).slice(2),
        x,
        y,
        rotation: Math.random() * 360,
        img: selectedInsect.img,
        caught: false
      }
    ]);
  }

  // Click/Touch insect
  function catchInsect(id) {
    setScore(s => {
      if (s + 1 > 60) setShowMsg(true);
      return s + 1;
    });
    setInsects(insects =>
      insects.map(insect =>
        insect.id === id ? { ...insect, caught: true } : insect
      )
    );
    setTimeout(() => {
      setInsects(insects => insects.filter(insect => insect.id !== id));
    }, 2000);
    // Add more insects (harder)
    setTimeout(() => createInsect(), 1000);
    setTimeout(() => createInsect(), 1500);
  }

  return (
    <div className="catch-the-insect">
      {/* Screen 1: Start */}
      {screen === 0 && (
        <div className="screen">
          <h1>Catch The Insect</h1>
          <button className="btn" onClick={() => setScreen(1)}>
            Play Game
          </button>
        </div>
      )}
      {/* Screen 2: Choose Insect */}
      {screen === 1 && (
        <div className="screen">
          <h1>What's your "favorite" insect?</h1>
          <ul className="insects-list">
            {INSECTS.map(insect => (
              <li key={insect.name}>
                <button
                  className="choose-insect-btn"
                  onClick={() => {
                    setSelectedInsect(insect);
                    setScreen(2);
                  }}
                >
                  <p>{insect.name}</p>
                  <img src={insect.img} alt={insect.name} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Screen 3: Game */}
      {screen === 2 && (
        <div className="screen game-container">
          <h3 className="time">{formatTime()}</h3>
          <h3 className="score">{`Score: ${score}`}</h3>
          <h5 className={`message${showMsg ? " visible" : ""}`}>
            Are you annoyed yet?
            <br /> You are playing an impossible game!!
          </h5>
          {insects.map(insect => (
            <div
              key={insect.id}
              className={`insect${insect.caught ? " caught" : ""}`}
              style={{
                top: insect.y,
                left: insect.x
              }}
              onClick={() => catchInsect(insect.id)}
            >
              <img
                src={insect.img}
                alt="insect"
                style={{
                  transform: `rotate(${insect.rotation}deg)`
                }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}