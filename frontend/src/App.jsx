import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import Rankings from "./pages/Rankings";
import Results from "./pages/Results";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/players" element={<Players />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </>
  )
}

export default App
