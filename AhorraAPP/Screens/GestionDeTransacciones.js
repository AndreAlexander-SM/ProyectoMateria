import React, { useState } from "react";
import Transacciones from "./Transacciones";
import Agregar from "./Agregar";
import Editar from "./Editar";
import Eliminar from "./Eliminar";

export default function GestionDeTransacciones({ navigation }) {
  const [pantalla, setPantalla] = useState("transacciones");

  switch (pantalla) {
    case "transacciones":
      return (
        <Transacciones
          onNext={() => setPantalla("agregar")}
          onEdit={() => setPantalla("editar")}
          navigation={navigation}
        />
      );

    case "agregar":
      return <Agregar onBack={() => setPantalla("transacciones")} />;

    case "editar":
      return (
        <Editar
          onNext={() => setPantalla("eliminar")}
          onBack={() => setPantalla("transacciones")}
        />
      );

    case "eliminar":
      return <Eliminar onBack={() => setPantalla("transacciones")} />;

    default:
      return null;
  }
}