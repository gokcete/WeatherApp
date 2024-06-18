import { APIProvider } from "./contexts/APIContext";
import { LocationProvider } from "./contexts/LocationContext";
import { WeatherProvider } from "./contexts/WeatherContext";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import About from "./components/About";
import NotFound from "./components/NotFound";

function App() {
  return (
    <APIProvider>
      <LocationProvider>
        <WeatherProvider>
          <main>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="about" element={<About />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </WeatherProvider>
      </LocationProvider>
    </APIProvider>
  );
}

export default App;
