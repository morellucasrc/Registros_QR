import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import "../styles/RegistroForm.css";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";




export default function RegistroForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    edad: "",
    direccion: "",
    estadoCivil: "",
    bautizado: "",
    genero: "",
  });

  const [id, setId] = useState("");
  const canvasRef = useRef(null);
  const [eventDate, setEventDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const actualizarFecha = () => {
      const nuevaFecha = localStorage.getItem("eventDate") || "";
      setEventDate(nuevaFecha);
    };

    window.addEventListener("fechaEventoActualizada", actualizarFecha);
    actualizarFecha();

    return () => {
      window.removeEventListener("fechaEventoActualizada", actualizarFecha);
    };
  }, []);

  useEffect(() => {
    if (formData.nombre && formData.apellido) {
      const nuevoId = "ID" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      setId(nuevoId);
      const qrTexto = `${formData.nombre} ${formData.apellido}-${nuevoId}`;

      QRCode.toCanvas(canvasRef.current, qrTexto, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000",
          light: "#fff",
        },
      });
    }
  }, [formData.nombre, formData.apellido]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistro = async () => {
    const valores = Object.values(formData);
    if (valores.includes("") || formData.bautizado === "") {
      setError("Por favor, completá todos los campos.");
      return;
    }

    const nuevoUsuario = {
      ...formData,
      id,
      asistencia: false,
      fechaEvento: eventDate,
    };

    try {
      await addDoc(collection(db, "usuarios"), nuevoUsuario);
      setError("");
      alert("Registrado correctamente en Firebase");
    } catch (error) {
      console.error("Error al registrar en Firebase:", error);
      setError("Hubo un error al registrar. Intentá de nuevo.");
    }
  };

  const descargarQR = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formData.nombre}_${id}.jpg`;
    link.click();
  };

  return (

    
  
    <div className="registro-form">
      
      {eventDate && <p><strong>Evento:</strong> {eventDate}</p>}

      {error && <p className="error-message">{error}</p>}
      <div className="hola">
        <p>Esta aplicación está pensada para que puedas llevar el control de tus eventos de forma fácil y rápida. Desde el primer momento, vas a poder registrar personas escaneando sus códigos QR, sin necesidad de hacer listas a mano ni usar papeles.

Una vez que los participantes están registrados, podés ver quiénes asistieron, quiénes no, y también organizar la lista según género. Todo está ordenado en tarjetas claras y fáciles de leer, con colores que te ayudan a identificar la asistencia de un vistazo.

También podés copiar información con un solo clic, borrar registros si es necesario, y ver un pequeño resumen del total de personas en cada categoría. Todo esto en una interfaz moderna, con un fondo elegante y un diseño que se adapta tanto al celular como a la computadora.

Con esta herramienta, controlar la asistencia de tu evento es más simple, rápido y visual.</p>
      </div>
      <div className="form-field">
        <label>Nombre</label>
        <input name="nombre" value={formData.nombre} onChange={handleChange} />
      </div>

      <div className="form-field">
        <label>Apellido</label>
        <input name="apellido" value={formData.apellido} onChange={handleChange} />
      </div>

      <div className="form-field">
        <label>Teléfono</label>
        <input name="telefono" value={formData.telefono} onChange={handleChange} type="tel" />
      </div>

      <div className="form-field">
        <label>Edad</label>
        <input name="edad" value={formData.edad} onChange={handleChange} type="number" />
      </div>

      <div className="form-field">
        <label>Dirección</label>
        <input name="direccion" value={formData.direccion} onChange={handleChange} />
      </div>

      <div className="form-field">
        <label>Estado civil</label>
        <input name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} />
      </div>

      <div className="form-field">
        <label>¿Está bautizado?</label>
        <div>
          <label>
            <input type="radio" name="bautizado" value="Sí" checked={formData.bautizado === "Sí"} onChange={handleChange} /> Sí
          </label>
          <label>
            <input type="radio" name="bautizado" value="No" checked={formData.bautizado === "No"} onChange={handleChange} /> No
          </label>
        </div>
      </div>

      <div className="form-field">
        <label>Género</label>
        <div>
          <label>
            <input type="radio" name="genero" value="Mujer" checked={formData.genero === "Mujer"} onChange={handleChange} /> Mujer
          </label>
          <label>
            <input type="radio" name="genero" value="Hombre" checked={formData.genero === "Hombre"} onChange={handleChange} /> Hombre
          </label>
        </div>
      </div>

      <button onClick={handleRegistro} className="btn-submit">Registrar</button>

      {id && (
        <div className="qr-preview">
          <canvas ref={canvasRef}></canvas>
          <button onClick={descargarQR} className="btn-download">Descargar QR</button>
        </div>
      )}
    </div>
  );
}
