import React, { useState } from "react";
import Transacciones from "./Transacciones";
import Agregar from "./Agregar";
import Editar from "./Editar";
import Eliminar from "./Eliminar";

export default function Gestion({ onBack }) {
  const [pantalla, setPantalla] = useState("transacciones");

  switch (pantalla) {
    case "transacciones":
      return <Transacciones onNext={() => setPantalla("agregar")} onBack={onBack} />;
    case "agregar":
      return <Agregar onNext={() => setPantalla("editar")} />;
    case "editar":
      return <Editar onNext={() => setPantalla("eliminar")} />;
    case "eliminar":
      return <Eliminar onBack={onBack} />;
    default:
      return null;
  }
}