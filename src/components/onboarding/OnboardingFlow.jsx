import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StartScreen from "./StartScreen";
import StepLocation from "./StepLocation";
import StepVibe from "./StepVibe";
import StepPeople from "./StepPeople";
import LoadingScreen from "./LoadingScreen";
import StepResults from "./StepResults";
import { newPerson } from "./StepPeople";

const STEPS = {
  START: "start",
  LOCATION: "location",
  VIBE: "vibe",
  PEOPLE: "people",
  LOADING: "loading",
  RESULTS: "results",
};

function ProgressBar({ step }) {
  const steps = [
    { id: STEPS.LOCATION, label: "Location" },
    { id: STEPS.VIBE, label: "Vibe" },
    { id: STEPS.PEOPLE, label: "Group" },
    { id: STEPS.RESULTS, label: "Results" },
  ];
  const displayStep = step === STEPS.LOADING ? STEPS.RESULTS : step;
  const activeIndex = steps.findIndex((s) => s.id === displayStep);

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-gray-100 bg-white px-4 py-3.5 sm:gap-3 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 shrink-0">
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 sm:h-9 sm:w-9 sm:text-base ${
                i < activeIndex
                  ? "bg-green-500 text-white"
                  : i === activeIndex
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < activeIndex ? "✓" : i + 1}
            </div>
            <span
              className={`text-sm font-semibold transition-colors sm:text-base ${
                i === activeIndex
                  ? "text-gray-900"
                  : i < activeIndex
                    ? "text-green-600"
                    : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`min-w-[0.75rem] flex-1 basis-4 rounded-full transition-all duration-500 h-1 sm:min-w-4 sm:basis-8 ${i < activeIndex ? "bg-green-400" : "bg-gray-100"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function OnboardingFlow() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [step, setStep] = useState(STEPS.START);
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null); // { lat, lon }
  const [vibe, setVibe] = useState([]);
  const [cuisine, setCuisine] = useState([]);
  const [people, setPeople] = useState([
    newPerson(1, "Person 1"),
    newPerson(2, "Person 2"),
  ]);

  /** Navbar "Start Here" uses `?step=location` to open step 1 (location) directly. */
  useEffect(() => {
    if (searchParams.get("step") !== "location") return;
    setStep(STEPS.LOCATION);
    setLocation("");
    setCoords(null);
    setVibe([]);
    setCuisine([]);
    setPeople([newPerson(1, "Person 1"), newPerson(2, "Person 2")]);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("step");
        return next;
      },
      { replace: true },
    );
  }, [searchParams, setSearchParams]);

  const handleReset = () => {
    setStep(STEPS.START);
    setLocation("");
    setCoords(null);
    setVibe([]);
    setCuisine([]);
    setPeople([newPerson(1, "Person 1"), newPerson(2, "Person 2")]);
  };

  const showProgress = step !== STEPS.START;

  return (
    <div className="flex flex-col h-full bg-white">
      {showProgress && <ProgressBar step={step} />}

      <div className="flex-1 overflow-hidden min-h-0">
        {step === STEPS.START && (
          <StartScreen onStart={() => setStep(STEPS.LOCATION)} />
        )}
        {step === STEPS.LOCATION && (
          <StepLocation
            value={location}
            onChange={(val, lat, lon) => {
              setLocation(val);
              if (lat != null && lon != null) setCoords({ lat, lon });
              else setCoords(null); // reset if user edits text after picking
            }}
            onNext={async () => {
              // If no coords yet, geocode the typed text before advancing
              if (!coords && location.trim()) {
                try {
                  const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`,
                    { headers: { "Accept-Language": "en" } },
                  );
                  const data = await res.json();
                  if (data[0])
                    setCoords({
                      lat: parseFloat(data[0].lat),
                      lon: parseFloat(data[0].lon),
                    });
                } catch {
                  /* proceed without coords */
                }
              }
              setStep(STEPS.VIBE);
            }}
          />
        )}
        {step === STEPS.VIBE && (
          <StepVibe
            vibe={vibe}
            cuisine={cuisine}
            onVibeChange={setVibe}
            onCuisineChange={setCuisine}
            onNext={() => setStep(STEPS.PEOPLE)}
            onBack={() => setStep(STEPS.LOCATION)}
          />
        )}
        {step === STEPS.PEOPLE && (
          <StepPeople
            people={people}
            onChange={setPeople}
            onNext={() => setStep(STEPS.LOADING)}
            onBack={() => setStep(STEPS.VIBE)}
          />
        )}
        {step === STEPS.LOADING && (
          <LoadingScreen
            onDone={() => setStep(STEPS.RESULTS)}
            people={people}
            vibe={vibe}
            cuisine={cuisine}
            location={location}
          />
        )}
        {step === STEPS.RESULTS && (
          <StepResults
            location={location}
            people={people}
            vibe={vibe}
            cuisine={cuisine}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
