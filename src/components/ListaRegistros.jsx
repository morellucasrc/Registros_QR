import React, { useState, useEffect } from 'react';
import '../styles/ListaRegistros.css';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function ListaRegistros() {
  const [usuarios, setUsuarios] = useState([]);
  const [generoFiltro, setGeneroFiltro] = useState("todos");
  const [fechaEvento, setFechaEvento] = useState("");

  // Obtener usuarios y fecha del evento desde Firestore
  useEffect(() => {
    const obtenerDatos = async () => {
      // Obtener usuarios de Firestore
      const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
      const usuariosDB = usuariosSnapshot.docs.map(doc => ({ ...doc.data(), firebaseId: doc.id }));

      // Obtener fecha del evento desde Firestore
      const fechaSnapshot = await getDocs(collection(db, "configuraciones"));
      if (!fechaSnapshot.empty) {
        setFechaEvento(fechaSnapshot.docs[0].data().fechaEvento);
      }

      setUsuarios(usuariosDB);
    };

    obtenerDatos();
  }, []);

  // Función para borrar todos los registros
  const borrarRegistros = async () => {
    if (window.confirm("¿Estás seguro de borrar todos los registros?")) {
      const snapshot = await getDocs(collection(db, "usuarios"));
      const batchDeletes = snapshot.docs.map(docu =>
        deleteDoc(doc(db, "usuarios", docu.id))
      );
      await Promise.all(batchDeletes);
      setUsuarios([]); // Limpiar lista local después de borrar
    }
  };

  // Filtrado por género
  const filtrados = usuarios.filter(u =>
    generoFiltro === "todos" || u.genero === generoFiltro
  );

  // Calcular la cantidad de presentes y ausentes
  const presentes = usuarios.filter(u => u.asistencia).length;
  const ausentes = usuarios.length - presentes;

  // Función para copiar la información del usuario al portapapeles
  const copiarInfo = (usuario) => {
    const texto = `
      Nombre: ${usuario.nombre} ${usuario.apellido}
      Teléfono: ${usuario.telefono}
      Edad: ${usuario.edad}
      Dirección: ${usuario.direccion}
      Estado Civil: ${usuario.estadoCivil}
      Bautizado: ${usuario.bautizado}
      Género: ${usuario.genero}
      ID: ${usuario.id}
      Asistencia: ${usuario.asistencia ? "✅ Presente" : "❌ Ausente"}
      Fecha del Evento: ${fechaEvento || "No disponible"}
    `;
    navigator.clipboard.writeText(texto).then(() => {
      alert('Información copiada al portapapeles');
    });
  };

  return (
    <div className="lista-container">
      <h2>Lista de Registros</h2>

      {/* Filtros de género */}
      <div className="filtros-genero">
        <button
          onClick={() => setGeneroFiltro("todos")}
          className={generoFiltro === "todos" ? "active" : ""}
        >
          Todos
        </button>
        <button
          onClick={() => setGeneroFiltro("Mujer")}
          className={generoFiltro === "Mujer" ? "active" : ""}
        >
          Mujeres
        </button>
        <button
          onClick={() => setGeneroFiltro("Hombre")}
          className={generoFiltro === "Hombre" ? "active" : ""}
        >
          Hombres
        </button>
      </div>

      {/* Resumen de presentes y ausentes */}
      <div className="resumen">
        <span>✅ Presentes: {presentes}</span>
        <span>❌ Ausentes: {ausentes}</span>
      </div>

      {/* Botón para borrar registros */}
      <button onClick={borrarRegistros} className="btn-borrar">
        Borrar todos
      </button>

      {/* Tarjetas de usuarios filtrados */}
      <div className="tarjetas-usuarios">
        {filtrados.map((u, i) => (
          <div key={i} className={`tarjeta ${u.asistencia ? 'asistio' : 'no-asistio'}`}>
            {/* Botón para copiar información del usuario */}
            <div className="copiar-info" onClick={() => copiarInfo(u)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="#4CAF50"
                className="copiar-icono"
                title="Copiar información"
              >
                <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 17c0 1.1.89 2 1.99 2h10c1.1 0 1.99-.9 1.99-2V5c0-1.1-.89-2-1.99-2zm0 14H7V5h10v12z" />
              </svg>
            </div>

            {/* Mostrar la fecha del evento si está disponible */}
            <div className="fecha-evento">
              {fechaEvento && <strong>Evento: {fechaEvento}</strong>}
            </div>

            {/* Detalles del usuario */}
            <h3>{u.nombre} {u.apellido}</h3>
            <p><strong>Teléfono:</strong> {u.telefono}</p>
            <p><strong>Edad:</strong> {u.edad}</p>
            <p><strong>Dirección:</strong> {u.direccion}</p>
            <p><strong>Estado civil:</strong> {u.estadoCivil}</p>
            <p><strong>Bautizado:</strong> {u.bautizado}</p>
            <p><strong>Género:</strong> {u.genero}</p>
            <p><strong>ID:</strong> {u.id}</p>
            <p><strong>Asistencia:</strong> {u.asistencia ? "🙋‍♂️/🙋‍♀️ Presente" : "🤦‍♀️/🤦‍♂️ Ausente"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
