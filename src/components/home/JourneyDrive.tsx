
import { useEffect, useState } from "react";
import { User } from "lucide-react"; // Import the User icon

// Import images properly
import taxiIcon from "/lovable-uploads/taxi-icon.png";
import stopSignIcon from "/lovable-uploads/Stop-Road-Sign.png";

const stops = [10, 35, 60, 85]; // % positions on the road

interface Passenger {
  id: number;
  waiting: boolean;
  boarded: boolean;
  color: string; // Added color property
}

interface TaxiData {
  id: number;
  position: number;
  passengerCount: number;
  currentStopIndex: number | null;
  isBoarding: boolean;
  isStopped: boolean;
  speed: number;
  bounceOffset: number;
}

// Uthutho brand colors for passengers
const passengerColors = ["#4ade80", "#facc15", "#fb923c", "#60a5fa"];

const JourneyDrive: React.FC = () => {
  const [taxi, setTaxi] = useState<TaxiData>({
    id: 1,
    position: 0,
    passengerCount: 0,
    currentStopIndex: null,
    isBoarding: false,
    isStopped: false,
    speed: 0.28,
    bounceOffset: 0,
  });

  // Fixed passenger data with colors
  const [passengers] = useState<Passenger[][]>([
    [
      { id: 1, waiting: true, boarded: false, color: passengerColors[0] },
      { id: 2, waiting: true, boarded: false, color: passengerColors[1] },
      { id: 3, waiting: true, boarded: false, color: passengerColors[2] },
    ],
    [
      { id: 1, waiting: true, boarded: false, color: passengerColors[0] },
      { id: 2, waiting: true, boarded: false, color: passengerColors[3] },
    ],
    [
      { id: 1, waiting: true, boarded: false, color: passengerColors[1] },
      { id: 2, waiting: true, boarded: false, color: passengerColors[2] },
      { id: 3, waiting: true, boarded: false, color: passengerColors[3] },
      { id: 4, waiting: true, boarded: false, color: passengerColors[0] },
    ],
    [
      { id: 1, waiting: true, boarded: false, color: passengerColors[1] },
      { id: 2, waiting: true, boarded: false, color: passengerColors[2] },
    ],
  ]);

  const [bounceTime, setBounceTime] = useState(0);
  const [currentPassengers, setCurrentPassengers] = useState<Passenger[][]>(
    JSON.parse(JSON.stringify(passengers))
  );
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showSpeechBubbles, setShowSpeechBubbles] = useState<boolean[][]>(
    stops.map(() => [])
  );
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);

  // Conversation sequence at Stop 4
  const conversationSequence = [
    { speaker: 0, text: "How far is the transport?" },
    { speaker: 1, text: "Check Uthutho" },
    { speaker: 0, text: "Ooh it's by Stop 2 going to Stop 3" },
    { speaker: 1, text: "This is Stop 4, the taxi is coming!" },
  ];

  // Initialize speech bubble visibility
  useEffect(() => {
    const initialBubbles = stops.map((_, stopIndex) => {
      return currentPassengers[stopIndex].map(() => false);
    });
    setShowSpeechBubbles(initialBubbles);
  }, []);

  // Bounce animation for road feel
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounceTime((prev) => (prev + 0.15) % (Math.PI * 2));
    }, 30);
    return () => clearInterval(bounceInterval);
  }, []);

  // Handle conversation at Stop 4, synchronized with taxi speed
  useEffect(() => {
    const conversationTriggerPosition = 13; // Start conversation early to sync with dialogue

    if (taxi.position > conversationTriggerPosition && currentConversationIndex === 0) {
      const startConversation = async () => {
        setCurrentConversationIndex(1); // Mark conversation as started

        const showBubble = (speakerIndex: number, visible: boolean) => {
          setShowSpeechBubbles(prev => {
            const newBubbles = prev.map((b, stopIdx) => {
              if (stopIdx === 3) { // Only for stop 4
                const newStopBubbles = [...b];
                newStopBubbles[speakerIndex] = visible;
                return newStopBubbles;
              }
              return [...b];
            });
            return newBubbles;
          });
        };

        const baseDelay = 2500; // 2.5 seconds

        for (let i = 0; i < conversationSequence.length; i++) {
          const msg = conversationSequence[i];
          const conversationSpeedFactor = 0.28 / (taxi.speed || 0.28);
          const dynamicDelay = baseDelay * conversationSpeedFactor;

          showBubble(msg.speaker, true);
          setCurrentConversationIndex(i + 1);

          await new Promise(resolve => setTimeout(resolve, dynamicDelay));

          showBubble(msg.speaker, false);

          if (i < conversationSequence.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }

        setTimeout(() => {
          setCurrentConversationIndex(conversationSequence.length + 1);
        }, 500);
      };

      startConversation();
    }
  }, [taxi.position, taxi.speed, currentConversationIndex, conversationSequence]);

  // Handle taxi movement and boarding
  useEffect(() => {
    const interval = setInterval(() => {
      setTaxi((prevTaxi) => {
        if (prevTaxi.isStopped || prevTaxi.isBoarding) {
          const bounceOffset = Math.sin(bounceTime * 3) * 1.5 * 0.5;
          return { ...prevTaxi, bounceOffset };
        }

        let newPosition = prevTaxi.position + prevTaxi.speed;
        let newIsStopped = false;
        let newIsBoarding = false;
        let newCurrentStopIndex = prevTaxi.currentStopIndex;

        for (let i = 0; i < stops.length; i++) {
          const distanceToStop = stops[i] - prevTaxi.position;

          if (
            distanceToStop > 0 &&
            distanceToStop < 1.5 &&
            !prevTaxi.currentStopIndex &&
            !prevTaxi.isStopped
          ) {
            const waitingCount = currentPassengers[i].filter(
              (p) => p.waiting && !p.boarded
            ).length;
            if (waitingCount > 0) {
              newPosition = stops[i];
              newIsStopped = true;
              newIsBoarding = true;
              newCurrentStopIndex = i;

              setTimeout(() => {
                setTaxi((currentTaxi) => {
                  if (
                    currentTaxi.currentStopIndex === i &&
                    currentTaxi.isBoarding
                  ) {
                    const waitingPassengers = currentPassengers[i].filter(
                      (p) => p.waiting && !p.boarded
                    );
                    const boardCount = waitingPassengers.length;

                    let boardedSoFar = 0;
                    const boardInterval = setInterval(() => {
                      boardedSoFar++;

                      setCurrentPassengers((prev) => {
                        const newPassengers = [...prev];
                        const stopPassengers = [...newPassengers[i]];
                        const waitingIndex = stopPassengers.findIndex(
                          (p) => p.waiting && !p.boarded
                        );
                        if (waitingIndex !== -1) {
                          stopPassengers[waitingIndex] = {
                            ...stopPassengers[waitingIndex],
                            waiting: false,
                            boarded: true,
                          };
                          newPassengers[i] = stopPassengers;
                        }
                        return newPassengers;
                      });

                      setTaxi((currentTaxi2) => ({
                        ...currentTaxi2,
                        passengerCount: currentTaxi2.passengerCount + 1,
                      }));

                      if (boardedSoFar >= boardCount) {
                        clearInterval(boardInterval);
                        setTimeout(() => {
                          setTaxi((currentTaxi3) => ({
                            ...currentTaxi3,
                            isStopped: false,
                            isBoarding: false,
                            currentStopIndex: null,
                            speed: 0.2 + Math.random() * 0.25,
                          }));
                        }, 500);
                      }
                    }, 450);

                    return { ...currentTaxi, isBoarding: true, isStopped: true };
                  }
                  return currentTaxi;
                });
              }, 50);

              break;
            }
          }
        }

        if (newPosition >= 100) {
          newPosition = 0;
          setResetTrigger((prev) => prev + 1);
        }

        const bounceOffset =
          Math.sin(bounceTime * 3) * 1.5 * (prevTaxi.speed * 2);

        return {
          ...prevTaxi,
          position: newPosition,
          isStopped: newIsStopped,
          isBoarding: newIsBoarding,
          currentStopIndex: newCurrentStopIndex,
          bounceOffset,
        };
      });
    }, 25);

    return () => clearInterval(interval);
  }, [bounceTime, currentPassengers, conversationSequence]);

  // Reset all state when taxi completes the route
  useEffect(() => {
    if (resetTrigger > 0) {
      setCurrentPassengers(JSON.parse(JSON.stringify(passengers)));
      setTaxi({
        id: 1,
        position: 0,
        passengerCount: 0,
        currentStopIndex: null,
        isBoarding: false,
        isStopped: false,
        speed: 0.28,
        bounceOffset: 0,
      });
      setCurrentConversationIndex(0);
      const initialBubbles = stops.map((_, stopIndex) =>
        passengers[stopIndex] ? passengers[stopIndex].map(() => false) : []
      );
      setShowSpeechBubbles(initialBubbles);
    }
  }, [resetTrigger, passengers]);

  return (
    <section className="py-20 bg-black text-white overflow-hidden">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Live Transport in Motion</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Uthutho captures real journeys as they happen. As the taxi moves,
          commuters at each stop signal demand, creating a live, shared view of
          the route. <span className="text-green-400">Commuter powered.</span>
        </p>
      </div>

      <div className="relative w-full max-w-5xl mx-auto">
        <div className="relative w-full h-64 border-t border-gray-700">
          <div
            className="absolute top-1/2 w-full h-px bg-yellow-500/20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, #eab308, #eab308 20px, transparent 20px, transparent 40px)",
            }}
          />

          {stops.map((stop, index) => {
            const waitingCount = currentPassengers[index]?.filter(
              (p) => p.waiting && !p.boarded
            ).length;
            const allBoarded = currentPassengers[index]?.every((p) => p.boarded);
            const isTaxiAtStop =
              taxi.isStopped && taxi.currentStopIndex === index;

            return (
              <div
                key={index}
                className="absolute text-center transition-all duration-300"
                style={{
                  left: `${stop}%`,
                  transform: "translateX(-50%)",
                  bottom: "30px",
                }}
              >
                <div className="relative mb-1">
                  <img
                    src={stopSignIcon}
                    alt={`Stop ${index + 1}`}
                    className="w-10 h-10 object-contain"
                  />
                  {waitingCount > 0 && !allBoarded && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {waitingCount}
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-2 mt-2">
                  {currentPassengers[index]?.map((passenger, pIdx) => {
                    if (passenger.waiting && !passenger.boarded) {
                      const delay = pIdx * 0.15;
                      return (
                        <div key={pIdx} className="relative">
                          <div
                            className="animate-bounce"
                            style={{
                              animationDelay: `${delay}s`,
                              animationDuration: "1s",
                            }}
                          >
                            <User
                              className="w-5 h-5"
                              style={{ color: passenger.color }}
                            />
                          </div>
                          {index === 3 && showSpeechBubbles[3]?.[pIdx] && (
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 mb-2 z-20 animate-fade-in-up" style={{ width: "max-content", maxWidth: "200px" }}>
                              <div className="relative bg-gray-800 text-white text-xs rounded-lg px-3 py-1.5 shadow-lg border border-green-500/30">
                                {conversationSequence.find((msg, seqIdx) =>
                                  seqIdx === currentConversationIndex - 1 &&
                                  msg.speaker === pIdx
                                )?.text}
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 border-r border-b border-green-500/30"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {isTaxiAtStop && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] text-green-400 whitespace-nowrap animate-pulse">
                    boarding...
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1">Stop {index + 1}</p>
              </div>
            );
          })}

          <div
            className="absolute transition-all duration-50 ease-linear"
            style={{
              left: `${taxi.position}%`,
              transform: `translateX(-50%) translateY(${taxi.bounceOffset}px)`,
              bottom: "30px",
              zIndex: 10,
            }}
          >
            <div className="relative">
              <img
                src={taxiIcon}
                alt="Taxi"
                className="w-16 object-contain"
              />
              {taxi.passengerCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {taxi.passengerCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12 text-left px-4">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-xl font-semibold mb-2 text-white">
            Continuous Journey Tracking
          </h3>
          <p className="text-gray-400">
            The vehicle moves in real time with variable speeds and road feel.
            The taxi stops completely at stops and waits until all passengers
            board.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-xl font-semibold mb-2 text-white">
            Demand at Every Stop
          </h3>
          <p className="text-gray-400">
            Passengers signal demand at each stop with animated waiting
            indicators, showing real passenger demand along the route.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-xl font-semibold mb-2 text-white">
            Data From Movement
          </h3>
          <p className="text-gray-400">
            Each passing journey builds a live data layer—turning informal
            transport into a structured, predictable system.
          </p>
        </div>
      </div>
    </section>
  );
};

export default JourneyDrive;
