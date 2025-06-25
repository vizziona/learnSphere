import React, { useState, useRef, useEffect } from "react";
import FlipCamButton from "../components/FlipCamButton.js";
import NN from "../contrib/WebARRocksHand/neuralNets/NN_NAV_19.json";
import navigationHelper from "../contrib/WebARRocksHand/helpers/HandTrackerNavigationHelper.js";
import pinchImage from "../../assets/pinch.png";

const compute_sizing = () => {
  const height = window.innerHeight;
  const width = window.innerWidth;
  const top = 0;
  const left = 0;
  return { width, height, top, left };
};

const Navigation = () => {
  const [sizing, setSizing] = useState(compute_sizing());
  const [isSelfieCam, setIsSelfieCam] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const clickSoundRef = useRef(null);

  const canvasVideoRef = useRef();
  const canvasPointerRef = useRef();
  const changeCameraButtonRef = useRef();
  const backButtonRef = useRef();

  // Menu card positions in a hexagonal layout (centered, radius-based)
  const centerX = sizing.width / 2;
  const centerY = sizing.height / 2;
  const radius = Math.min(sizing.width, sizing.height) * 0.4;
  const minDistanceFromCenter = 200;

  const menuCards = [
    {
      id: "home",
      label: "Home",
      icon: "🏠",
      x: centerX,
      y: Math.max(centerY - radius, centerY - minDistanceFromCenter),
    },
    {
      id: "image",
      label: "Menu",
      icon: "🌄",
      x: Math.min(centerX + radius * 0.866, centerX + minDistanceFromCenter),
      y: Math.max(centerY - radius * 0.5, centerY - minDistanceFromCenter),
    },
    {
      id: "object",
      label: "Services",
      icon: "🌍",
      x: Math.min(centerX + radius * 0.866, centerX + minDistanceFromCenter),
      y: Math.min(centerY + radius * 0.5, centerY + minDistanceFromCenter),
    },
    {
      id: "contact",
      label: "Contact",
      icon: "✉",
      x: centerX,
      y: Math.min(centerY + radius, centerY + minDistanceFromCenter),
    },
    {
      id: "follow",
      label: "Follow us",
      icon: "👤",
      x: Math.max(centerX - radius * 0.866, centerX - minDistanceFromCenter),
      y: Math.min(centerY + radius * 0.5, centerY + minDistanceFromCenter),
    },
    {
      id: "face",
      label: "learnSphere AR",
      icon: "😊",
      x: Math.max(centerX - radius * 0.866, centerX - minDistanceFromCenter),
      y: Math.max(centerY - radius * 0.5, centerY - minDistanceFromCenter),
    },
  ].map((card) => ({
    ...card,
    width: 170,
    height: 170,
  }));

  // Initialize click sound
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
        console.log(
          "Video feed active:",
          canvasVideoRef.current.captureStream ? "Yes" : "No"
        );
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

        console.log("Pointer down at:", { originalX: x, adjustedX, y });

        if (activePopup && backButtonRef.current) {
          const rect = backButtonRef.current.getBoundingClientRect();
          console.log("Back button rect:", rect);

          if (
            adjustedX >= rect.left &&
            adjustedX <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
          ) {
            console.log("Back button clicked, closing popup");
            playClickSound();
            setActivePopup(null);
            return;
          }
        } else {
          const card = menuCards.find(
            (c) =>
              adjustedX >= c.x - c.width / 2 &&
              adjustedX <= c.x + c.width / 2 &&
              y >= c.y - c.height / 2 &&
              y <= c.y + c.height / 2
          );
          if (card) {
            console.log(`Clicked ${card.label} at (${adjustedX}, ${y})`);
            playClickSound();
            setActivePopup(card.id);
          }
        }
      },
      onPointerUp: (x, y) => console.log("Pointer up at: ", x, y),
      onPointerMove: (x, y, isDown) => {
        // console.log("Pointer move at:", { x, y, isDown });
      },
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
  }, [sizing, isSelfieCam]);

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
    pointerEvents: "auto",
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

  const listItemStyle = {
    fontSize: "16px",
    marginBottom: "10px",
    paddingLeft: "10px",
    display: "flex",
    alignItems: "flex-start",
  };

  const bulletStyle = {
    marginRight: "10px",
    color: "white",
  };

  const footerStyle = {
    marginTop: "auto",
    padding: "20px 0",
    borderTop: "1px solid rgba(255,255,255,0.2)",
  };

  const iconStyle = {
    fontSize: "32px",
    marginBottom: "5px",
  };

  const labelStyle = {
    fontSize: "20px",
    textAlign: "center",
  };

  const getPopupContent = () => {
    switch (activePopup) {
      case "home":
        return {
          title: "Home",
          content: "Learn more about us and our WebAR technologies.",
        };
      case "image":
        return {
          title: "LearnSphere",
          content: "Our image tracking solution for augmented reality.",
        };
      case "object":
        return {
          title: "LearnSphere",
          content:
            "This is our generalistic object detection and tracking solution.",
          bulletPoints: [
            "It is fully web based and mobile friendly.",
            "THREE.js is used as 3D rendering engine.",
            "We can train a neural network to detect a general concept",
            "Integration demos are provided both in static JavaScript",
          ],
          footer: "Welcome to LearnSphere: https://vizziona.tech.",
        };
      case "contact":
        return {
          title: "Contact",
          content: "Get in touch with our team for any inquiries.",
        };
      case "follow":
        return {
          title: "Follow",
          content: "Follow us on social media for updates and news.",
        };
      case "face":
        return {
          title: "LearnSphere",
          content:
            "Our face tracking solution for augmented reality applications.",
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
          menuCards.map((card) => (
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
                playClickSound();
                setActivePopup(card.id);
              }}
            >
              <div style={iconStyle}>{card.icon}</div>
              <div style={labelStyle}>{card.label}</div>
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
            console.log("Back button clicked via mouse/touch");
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
              {popupContent.bulletPoints && (
                <ul
                  style={{
                    listStyleType: "none",
                    padding: 0,
                    margin: "20px 0",
                  }}
                >
                  {popupContent.bulletPoints.map((point, index) => (
                    <li key={index} style={listItemStyle}>
                      <span style={bulletStyle}>•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
              {popupContent.footer && (
                <div style={footerStyle}>
                  <p style={{ fontSize: "16px" }}>{popupContent.footer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showInstruction && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <img
              src={pinchImage}
              alt="Pinch to click"
              style={{
                width: "80px",
                height: "90px",
              }}
            />
          </div>
          <div style={{ fontSize: "18px" }}>Pinch to click</div>
          <div style={{ fontSize: "14px", opacity: 0.8 }}>
            Hand open, fully visible
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
