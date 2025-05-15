// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegistroForm from "./components/RegistroForm";
import ListaRegistros from "./components/ListaRegistros";
import EscanearQR from "./components/EscanearQR";
import "./styles/App.css";

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<RegistroForm />} />
          {isLoggedIn && <Route path="/registros" element={<ListaRegistros />} />}
          {isLoggedIn && <Route path="/escanear" element={<EscanearQR />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
