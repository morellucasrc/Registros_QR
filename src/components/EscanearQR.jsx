
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode'; // ✅ ESTA ES LA LÍNEA AÑADIDA
import '../styles/EscanearQR.css';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const EscanearQR = () => {
  const [mensaje, setMensaje] = useState("");
  const [scanning, setScanning] = useState(false); // Nuevo estado para controlar el escaneo

  const iniciarEscaneo = async (scanner) => {
    try {
      await scanner.render(
        async (decodedText) => {
          if (scanning) return; // Evita la repetición de escaneos rápidos
          setScanning(true);
          
          const partesQR = decodedText.split("-");
          if (partesQR.length === 2) {
            const id = partesQR[1];
            try {
              const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
              const usuarios = usuariosSnapshot.docs;

              let encontrado = false;
              for (const docu of usuarios) {
                const data = docu.data();
                if (data.id === id) {
                  await updateDoc(doc(db, "usuarios", docu.id), { asistencia: true });
                  setMensaje(`✅ Asistencia registrada: ${data.nombre}`);
                  encontrado = true;
                  break;
                }
              }

              if (!encontrado) {
                setMensaje("❌ QR no reconocido");
              }
            } catch (error) {
              console.error("Error al buscar o actualizar el usuario en Firebase:", error);
              setMensaje("⚠️ Error en la base de datos");
            }
          } else {
            setMensaje("⚠️ Formato de QR incorrecto");
          }

          // Restablece el estado de escaneo después de 4 segundos
          setTimeout(() => {
            setMensaje("");
            setScanning(false);
          }, 4000);
        },
        (error) => console.warn("Error de escaneo:", error)
      );
    } catch (err) {
      console.error("Error al iniciar el escáner:", err);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
    iniciarEscaneo(scanner);

    return () => {
      scanner.clear().catch(error => console.log(error));
    };
  }, [scanning]);

  return (
    <div className="scanner-container">
      <div id="reader"></div>
      {mensaje && <div className="mensaje">{mensaje}</div>}
    </div>
  );
};

export default EscanearQR;
