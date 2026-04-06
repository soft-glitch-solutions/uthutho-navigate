import { useEffect, useState } from "react";

// Import images properly
import taxiIcon from "/lovable-uploads/taxi-icon.png";
import stopSignIcon from "/lovable-uploads/Stop-Road-Sign.png";

const stops = [10, 35, 60, 85]; // % positions on the road

interface Passenger {
  id: number;
  waiting: boolean;
  boarded: boolean;
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
  
  // Fixed passenger data
  const [passengers] = useState<Passenger[][]>([
    [{ id: 1, waiting: true, boarded: false }, { id: 2, waiting: true, boarded: false }, { id: 3, waiting: true, boarded: false }],
    [{ id: 1, waiting: true, boarded: false }, { id: 2, waiting: true, boarded: false }],
    [{ id: 1, waiting: true, boarded: false }, { id: 2, waiting: true, boarded: false }, { id: 3, waiting: true, boarded: false }, { id: 4, waiting: true, boarded: false }],
    [{ id: 1, waiting: true, boarded: false }, { id: 2, waiting: true, boarded: false }],
  ]);
  
  const [bounceTime, setBounceTime] = useState(0);
  const [currentPassengers, setCurrentPassengers] = useState<Passenger[][]>(JSON.parse(JSON.stringify(passengers)));
  const [resetTrigger, setResetTrigger] = useState(0);

  // Bounce animation for road feel
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounceTime(prev => (prev + 0.15) % (Math.PI * 2));
    }, 30);
    return () => clearInterval(bounceInterval);
  }, []);

  const isAtStop = (position: number, stopPercent: number) => {
    return Math.abs(position - stopPercent) < 1.0;
  };

  // Handle taxi movement and boarding
  useEffect(() => {
    const interval = setInterval(() => {
      setTaxi(prevTaxi => {
        // If taxi is stopped or boarding, don't move
        if (prevTaxi.isStopped || prevTaxi.isBoarding) {
          const bounceOffset = Math.sin(bounceTime * 3) * 1.5 * 0.5;
          return { ...prevTaxi, bounceOffset };
        }
        
        let newPosition = prevTaxi.position + prevTaxi.speed;
        let newIsStopped = false;
        let newIsBoarding = false;
        let newCurrentStopIndex = prevTaxi.currentStopIndex;
        
        // Check if taxi reached a stop
        for (let i = 0; i < stops.length; i++) {
          const distanceToStop = stops[i] - prevTaxi.position;
          
          // If taxi is very close to a stop
          if (distanceToStop > 0 && distanceToStop < 1.5 && !prevTaxi.currentStopIndex && !prevTaxi.isStopped) {
            const waitingCount = currentPassengers[i].filter(p => p.waiting && !p.boarded).length;
            if (waitingCount > 0) {
              // Stop exactly at the stop position
              newPosition = stops[i];
              newIsStopped = true;
              newIsBoarding = true;
              newCurrentStopIndex = i;
              
              // Start boarding process
              setTimeout(() => {
                setTaxi(currentTaxi => {
                  if (currentTaxi.currentStopIndex === i && currentTaxi.isBoarding) {
                    const waitingPassengers = currentPassengers[i].filter(p => p.waiting && !p.boarded);
                    const boardCount = waitingPassengers.length;
                    
                    let boardedSoFar = 0;
                    const boardInterval = setInterval(() => {
                      boardedSoFar++;
                      
                      // Update passenger status one by one
                      setCurrentPassengers(prev => {
                        const newPassengers = [...prev];
                        const stopPassengers = [...newPassengers[i]];
                        const waitingIndex = stopPassengers.findIndex(p => p.waiting && !p.boarded);
                        if (waitingIndex !== -1) {
                          stopPassengers[waitingIndex] = { ...stopPassengers[waitingIndex], waiting: false, boarded: true };
                          newPassengers[i] = stopPassengers;
                        }
                        return newPassengers;
                      });
                      
                      setTaxi(currentTaxi2 => {
                        return { ...currentTaxi2, passengerCount: currentTaxi2.passengerCount + 1 };
                      });
                      
                      if (boardedSoFar >= boardCount) {
                        clearInterval(boardInterval);
                        // After all passengers boarded, wait then start driving
                        setTimeout(() => {
                          setTaxi(currentTaxi3 => {
                            return { 
                              ...currentTaxi3, 
                              isStopped: false, 
                              isBoarding: false, 
                              currentStopIndex: null,
                              speed: 0.2 + Math.random() * 0.25
                            };
                          });
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
        
        // Reset position when reaching end and reset all state for replay
        if (newPosition >= 100) {
          newPosition = 0;
          // Trigger full reset
          setResetTrigger(prev => prev + 1);
        }
        
        // Calculate bounce offset for road feel
        const bounceOffset = Math.sin(bounceTime * 3) * 1.5 * (prevTaxi.speed * 2);
        
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
  }, [bounceTime, currentPassengers]);

  // Reset all state when taxi completes the route (replay the scene)
  useEffect(() => {
    if (resetTrigger > 0) {
      // Reset passengers to original state
      setCurrentPassengers(JSON.parse(JSON.stringify(passengers)));
      // Reset taxi
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
    }
  }, [resetTrigger, passengers]);

  return (
    <section className="py-20 bg-black text-white overflow-hidden">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          Live Transport in Motion
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Uthutho captures real journeys as they happen. As the taxi moves,
          commuters at each stop signal demand, creating a live, shared view
          of the route. <span className="text-green-400">Commuter powered.</span>
        </p>
      </div>

      {/* Road Container */}
      <div className="relative w-full max-w-5xl mx-auto">
        {/* Road */}
        <div className="relative w-full h-64 border-t border-gray-700">
          {/* Road dashed line */}
          <div className="absolute top-1/2 w-full h-px bg-yellow-500/20" 
               style={{ backgroundImage: "repeating-linear-gradient(90deg, #eab308, #eab308 20px, transparent 20px, transparent 40px)" }} />

          {/* Stops */}
          {stops.map((stop, index) => {
            const waitingCount = currentPassengers[index].filter(p => p.waiting && !p.boarded).length;
            const allBoarded = currentPassengers[index].every(p => p.boarded);
            const isTaxiAtStop = taxi.isStopped && taxi.currentStopIndex === index;

            return (
              <div
                key={index}
                className="absolute text-center transition-all duration-300"
                style={{ left: `${stop}%`, transform: "translateX(-50%)", bottom: "30px" }}
              >
                {/* Stop Sign */}
                <div className="relative mb-1">
                  <img
                    src={stopSignIcon}
                    alt={`Stop ${index + 1}`}
                    className="w-10 h-10 object-contain"
                  />
                  {/* Waiting count badge */}
                  {waitingCount > 0 && !allBoarded && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {waitingCount}
                    </div>
                  )}
                </div>

                {/* Animated waiting dots */}
                <div className="flex justify-center gap-1 mt-1">
                  {currentPassengers[index].map((passenger, pIdx) => {
                    if (passenger.waiting && !passenger.boarded) {
                      const delay = pIdx * 0.1;
                      return (
                        <div
                          key={pIdx}
                          className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}s`, animationDuration: "0.6s" }}
                        />
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Boarding indicator */}
                {isTaxiAtStop && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] text-green-400 whitespace-nowrap animate-pulse">
                    boarding...
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1">Stop {index + 1}</p>
              </div>
            );
          })}

          {/* Single Taxi */}
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
              {/* Passenger count */}
              {taxi.passengerCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {taxi.passengerCount}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>



      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12 text-left px-4">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-xl font-semibold mb-2 text-white">
            Continuous Journey Tracking
          </h3>
          <p className="text-gray-400">
            The vehicle moves in real time with variable speeds and road feel.
            The taxi stops completely at stops and waits until all passengers board.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-xl font-semibold mb-2 text-white">
            Demand at Every Stop
          </h3>
          <p className="text-gray-400">
            Passengers signal demand at each stop with animated waiting indicators,
            showing real passenger demand along the route.
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