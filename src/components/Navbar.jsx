import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import "../styles/Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [eventDate, setEventDate] = useState(localStorage.getItem("eventDate") || "");
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    localStorage.setItem("eventDate", eventDate);
  }, [eventDate]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "iglesiajoven") {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      alert('Acceso exitoso');
      setShowLoginForm(false);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  const handleEventDateChange = () => {
    localStorage.setItem("eventDate", eventDate);
    window.dispatchEvent(new Event("fechaEventoActualizada"));
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Registro de Asistencia</h1>

      <div className={`nav-toggle ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </div>

      <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
        <li><NavLink exact="true" to="/" onClick={() => setMenuOpen(false)}>Registrar</NavLink></li>
        {isLoggedIn && (
          <>
            <li><NavLink to="/registros" onClick={() => setMenuOpen(false)}>Lista</NavLink></li>
            <li><NavLink to="/escanear" onClick={() => setMenuOpen(false)}>Escanear</NavLink></li>
          </>
        )}
      </ul>

      {isLoggedIn ? (
        <>
          <div className="event-date-container">
            <input
              type="text"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="Fecha del evento"
            />
            <button onClick={handleEventDateChange}>Guardar fecha</button>
          </div>
          <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
        </>
      ) : (
        <>
          <div className="login-toggle-btn" onClick={() => setShowLoginForm(!showLoginForm)}>
            {showLoginForm ? 'Ocultar Login' : 'Iniciar Sesión'}
          </div>

          <form
            onSubmit={handleLoginSubmit}
            className={`login-form ${showLoginForm ? 'show' : ''}`}
          >
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Iniciar sesión</button>
          </form>
        </>
      )}
    </nav>
  );
}
