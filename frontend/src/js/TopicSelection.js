import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import FlipCamButton from "./components/FlipCamButton.js";
import NN from "./contrib/WebARRocksHand/neuralNets/NN_NAV_19.json";
import navigationHelper from "./contrib/WebARRocksHand/helpers/HandTrackerNavigationHelper.js";
import pinchImage from "../assets/pinch.png";

const compute_sizing = () => {
  const height = window.innerHeight;
  const width = window.innerWidth;
  const top = 0;
  const left = 0;
  return { width, height, top, left };
};

const TopicSelection = () => {
  const history = useHistory();
  const [sizing, setSizing] = useState(compute_sizing());
  const [isSelfieCam, setIsSelfieCam] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const clickSoundRef = useRef(null);
  const canvasVideoRef = useRef();
  const canvasPointerRef = useRef();
  const changeCameraButtonRef = useRef();
  const backButtonRef = useRef();
  const [topicCards, setTopicCards] = useState([]);
  const topicCardsRef = useRef(topicCards);

  const [centerX, setCenterX] = useState(sizing.width / 2);
  const [centerY, setCenterY] = useState(sizing.height / 2);
  const [radius, setRadius] = useState(
    Math.min(sizing.width, sizing.height) * 0.4
  );

  useEffect(() => {
    setCenterX(sizing.width / 2);
    setCenterY(sizing.height / 2);
    setRadius(Math.min(sizing.width, sizing.height) * 0.4);
  }, [sizing]);

  const cardWidth = 170;
  const cardHeight = 170;
  const margin = 20;

  // Update topicCardsRef whenever topicCards changes
  useEffect(() => {
    topicCardsRef.current = topicCards;
  }, [topicCards]);

  // Fetch topics from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/topics")
      .then((response) => response.json())
      .then((data) =>
        setTopicCards(
          data.map((card, index) => ({
            id: card.id,
            label: card.label,
            icon: card.icon,
            x:
              index === 0
                ? Math.max(
                    margin + cardWidth / 2,
                    Math.min(
                      sizing.width - margin - cardWidth / 2,
                      centerX - radius
                    )
                  )
                : index === 1
                ? centerX
                : Math.max(
                    margin + cardWidth / 2,
                    Math.min(
                      sizing.width - margin - cardWidth / 2,
                      centerX + radius
                    )
                  ),
            y: centerY,
            route: `/${card.id}`,
            width: cardWidth,
            height: cardHeight,
          }))
        )
      )
      .catch((error) => console.error("Error fetching topics:", error));
  }, [sizing, centerX, centerY, radius]);

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    const playClickSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 1000;

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.1
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    };

    clickSoundRef.current = playClickSound;

    return () => {
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
      }
    };
  }, []);

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current();
    }
  };

  let _timerResize = null;
  const handle_resize = () => {
    if (_timerResize) {
      clearTimeout(_timerResize);
    }
    _timerResize = setTimeout(do_resize, 200);
  };

  const do_resize = () => {
    _timerResize = null;
    const newSizing = compute_sizing();
    setSizing(newSizing);
    canvasVideoRef.current.width = newSizing.width;
    canvasVideoRef.current.height = newSizing.height;
    canvasPointerRef.current.width = newSizing.width;
    canvasPointerRef.current.height = newSizing.height;
    navigationHelper.resize();
  };

  useEffect(() => {
    window.addEventListener("resize", handle_resize);
    window.addEventListener("orientationchange", handle_resize);

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const maxDim = Math.max(window.innerWidth, window.innerHeight);
    const scale = Math.min(1, 1024 / maxDim);
    const idealWidth = Math.round(window.innerWidth * dpr * scale);
    const idealHeight = Math.round(window.innerHeight * dpr * scale);

    navigationHelper.init({
      canvasVideo: canvasVideoRef.current,
      canvasPointer: canvasPointerRef.current,
      NNs: [NN],
      threshold: 0.9,
      videoSettings: {
        idealWidth: Math.max(idealHeight, idealWidth),
        idealHeight: Math.min(idealHeight, idealWidth),
      },
      callbackReady: (err, objs) => {
        if (err) {
          console.error("Navigation initialization error: ", err);
          if (err === "WEBCAM_UNAVAILABLE") {
            alert(
              "Camera unavailable. Please ensure your device has a camera and permissions are granted."
            );
          }
          return;
        }
        console.log("Navigation initialized successfully", objs);
        navigationHelper.resize();
        if (!objs.isMobileOrTablet && changeCameraButtonRef.current) {
          changeCameraButtonRef.current.style.display = "block";
        }
      },
      GLSLChangeVideoColor: `
        float grayScale = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        color = vec4(grayScale * vec3(0.0, 0.0, 1.0), 1.0);
      `,
      landmarks: [
        "index0",
        "index1",
        "index2",
        "index3",
        "thumb2",
        "thumb1",
        "thumb0",
      ],
      lines: [
        ["index0", "index1"],
        ["index1", "index2"],
        ["index2", "index3"],
        ["index3", "thumb2"],
        ["thumb2", "thumb1"],
        ["thumb1", "thumb0"],
      ],
      lineWidth: 2,
      pointRadius: 12,
      GLSLPointerLineColor:
        "color = mix(vec3(0.0, 0.8, 1.0), vec3(1.0, 0.0, 0.0), vIsPointer * downFactor);",
      GLSLPointerPointColor:
        "color = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), vIsPointer * downFactor);",
      GLSLPointerCursorColor:
        "color = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), downFactor);",
      cursorAngle: 30,
      cursorRecess: 0.33,
      cursorSizePx: 32,
      pointerLandmarks: ["index0", "thumb0"],
      pointerDistancesPalmSide: [0.3, 0.25],
      pointerDistancesBackSide: [0.2, 0.15],
      pointerHeatDistance: 0.05,
      pointerBlendHandRadiusRange: [1, 3],
      onPointerDown: (x, y) => {
        let adjustedX = x;
        if (isSelfieCam) {
          adjustedX = sizing.width - x;
        }

        if (activePopup && backButtonRef.current) {
          const rect = backButtonRef.current.getBoundingClientRect();
          if (
            adjustedX >= rect.left &&
            adjustedX <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
          ) {
            playClickSound();
            setActivePopup(null);
            return;
          }
        } else {
          const card = topicCardsRef.current.find(
            (c) =>
              adjustedX >= c.x - c.width / 2 &&
              adjustedX <= c.x + c.width / 2 &&
              y >= c.y - c.height / 2 &&
              y <= c.y + c.height / 2
          );
          if (card) {
            console.log(
              `Hand tracking clicked ${card.label} at (${adjustedX}, ${y})`
            );
            playClickSound();
            history.push(card.route);
          }
        }
      },
      onPointerUp: (x, y) => console.log("Pointer up at: ", x, y),
      onPointerMove: (x, y, isDown) => {},
    });

    let lastTime = performance.now();
    let frameCount = 0;
    const checkFPS = (time) => {
      frameCount++;
      if (time - lastTime >= 1000) {
        console.log(`Hand tracking FPS: ${frameCount}`);
        frameCount = 0;
        lastTime = time;
      }
      requestAnimationFrame(checkFPS);
    };
    requestAnimationFrame(checkFPS);

    return () => {
      window.removeEventListener("resize", handle_resize);
      window.removeEventListener("orientationchange", handle_resize);
      navigationHelper.destroy();
    };
  }, [sizing, isSelfieCam, history]);

  const change_camera = () => {
    setIsSelfieCam(!isSelfieCam);
    navigationHelper.change_camera();
  };

  useEffect(() => {
    if (activePopup) {
      console.log("Popup should be rendering for:", activePopup);
    } else {
      console.log("No popup active");
    }
  }, [activePopup]);

  const mirrorClass = isSelfieCam ? "mirrorX" : "";
  const canvasStyle = {
    position: "fixed",
    zIndex: 1,
    top: 0,
    left: 0,
    pointerEvents: "none",
  };
  const canvasPointerContainerStyle = {
    position: "fixed",
    zIndex: 100,
    top: 0,
    left: 0,
    pointerEvents: "none",
  };

  const menuCardStyle = {
    position: "absolute",
    width: "170px",
    height: "170px",
    backgroundColor: "transparent",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    border: "2px solid white",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: "bold",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "transform 0.2s",
    zIndex: 10,
    pointerEvents: "auto", // Ensure cards receive click/touch events
  };

  const popupStyle = {
    position: "fixed",
    top: 0,
    left: "50%",
    transform: isSelfieCam ? "translateX(-50%) scaleX(-1)" : "translateX(-50%)",
    backgroundColor: "transparent",
    color: "white",
    width: "calc(100% - 10px)",
    maxWidth: "700px",
    height: "auto",
    maxHeight: "calc(100% - 60px)",
    padding: "20px",
    zIndex: 5,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    pointerEvents: "none",
  };

  const contentBgStyle = {
    backgroundColor: "rgba(0, 51, 102, 0.7)",
    padding: "20px",
    borderRadius: "8px",
    backdropFilter: "blur(5px)",
    pointerEvents: "none",
  };

  const backButtonStyle = {
    position: "absolute",
    top: "10%",
    right: "10%",
    backgroundColor: "#f0f0f0",
    color: "#000",
    border: "none",
    padding: "18px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    zIndex: 200,
    borderRadius: "15px",
    cursor: "pointer",
    pointerEvents: "auto", // Ensure button receives click/touch events
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  };

  const contentStyle = {
    marginTop: "60px",
    padding: "10px",
    lineHeight: "1.6",
    pointerEvents: "none",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "white",
    fontFamily: "monospace",
  };

  const paragraphStyle = {
    fontSize: "18px",
    marginBottom: "15px",
    color: "white",
    maxWidth: "800px",
  };

  const getPopupContent = () => {
    switch (activePopup) {
      case "physics":
        return {
          title: "Physics",
          content: "Explore interactive physics experiments in AR.",
        };
      case "ict":
        return {
          title: "ICT",
          content: "Learn about computer systems and networks in AR.",
        };
      case "fun":
        return {
          title: "RELAX/FUN",
          content: "Having Fun by playing Fun AR Games.",
        };
      default:
        return {
          title: "",
          content: "",
        };
    }
  };

  const popupContent = getPopupContent();
  const showInstruction = !activePopup;

  return (
    <div>
      <div style={canvasPointerContainerStyle}>
        <canvas
          className={mirrorClass}
          ref={canvasPointerRef}
          style={canvasStyle}
          width={sizing.width}
          height={sizing.height}
        />
        {!activePopup &&
          topicCards.map((card) => (
            <div
              key={card.id}
              style={{
                ...menuCardStyle,
                left: card.x - card.width / 2,
                top: card.y - card.height / 2,
                transform: isSelfieCam ? "scaleX(-1)" : "none",
              }}
              onMouseEnter={(e) =>
                (e.target.style.transform = isSelfieCam
                  ? "scaleX(-1) scale(1.1)"
                  : "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.target.style.transform = isSelfieCam ? "scaleX(-1)" : "none")
              }
              onClick={() => {
                console.log(`Manual click on ${card.label}`);
                playClickSound();
                history.push(card.route);
              }}
              onTouchStart={(e) => {
                e.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
                console.log(`Touch click on ${card.label}`);
                playClickSound();
                history.push(card.route);
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "5px" }}>
                {card.icon}
              </div>
              <div style={{ fontSize: "20px", textAlign: "center" }}>
                {card.label}
              </div>
            </div>
          ))}
      </div>
      <canvas
        className={mirrorClass}
        ref={canvasVideoRef}
        style={canvasStyle}
        width={sizing.width}
        height={sizing.height}
      />
      {!activePopup && (
        <FlipCamButton ref={changeCameraButtonRef} onClick={change_camera} />
      )}
      {activePopup && (
        <button
          ref={backButtonRef}
          style={backButtonStyle}
          onClick={() => {
            console.log("Manual click on back button");
            playClickSound();
            setActivePopup(null);
          }}
          onTouchStart={(e) => {
            e.preventDefault(); // Prevent default touch behavior
            console.log("Touch click on back button");
            playClickSound();
            setActivePopup(null);
          }}
        >
          ← BACK
        </button>
      )}
      {activePopup && (
        <div style={popupStyle}>
          <div style={contentStyle}>
            <div style={contentBgStyle}>
              <h1 style={titleStyle}>{popupContent.title}</h1>
              {popupContent.content && (
                <p style={paragraphStyle}>{popupContent.content}</p>
              )}
            </div>
          </div>
        </div>
      )}
      {showInstruction && (
        <div
          style={{
            position: "fixed",
            bottom: "10%",
            left: "50%",
            transform: isSelfieCam
              ? "translateX(-50%) scaleX(-1)"
              : "translateX(-50%)",
            color: "white",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <img
              src={pinchImage}
              alt="Pinch to click"
              style={{
                width: "60px",
                height: "70px",
              }}
            />
          </div>
          <div style={{ fontSize: "16px" }}>Pinch to click</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            Hand open, fully visible
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicSelection;
