import React, { useState } from "react";
import Transacciones from "./Transacciones";
import Agregar from "./Agregar";
import Editar from "./Editar";
import Eliminar from "./Eliminar";
import { TransaccionController } from "../controllers/TransaccionController";
import { UsuarioController } from "../controllers/UsuarioController";

export default function GestionDeTransacciones({ navigation }) {
  const [pantalla, setPantalla] = useState("transacciones");
  const [transaccionEdit, setTransaccionEdit] = useState(null);

  const transCtrl = new TransaccionController();
  const userCtrl = new UsuarioController();
  const usuario = userCtrl.getUsuarioActivo();

  const handleGuardar = async (monto, categoria, fecha, descripcion, tipo) => {
    if (!usuario) return;
    await transCtrl.agregar(usuario.id, monto, categoria, fecha, descripcion, tipo);
    setPantalla("transacciones");
  };

  const handleActualizar = async (monto, categoria, fecha, descripcion, tipo) => {
    if (!transaccionEdit) return;
    await transCtrl.editar(
      transaccionEdit.id,
      monto,
      categoria,
      fecha,
      descripcion,
      tipo
    );
    setPantalla("transacciones");
  };

  const handleEliminarDefinitivo = async () => {
    if (!transaccionEdit) return;
    await transCtrl.eliminar(transaccionEdit.id);
    setPantalla("transacciones");
  };

  switch (pantalla) {
    case "transacciones":
      return (
        <Transacciones
          onNext={() => setPantalla("agregar")}
          onEdit={(item) => {
            setTransaccionEdit(item);
            setPantalla("editar");
          }}
          navigation={navigation}
        />
      );

    case "agregar":
      return (
        <Agregar
          onBack={() => setPantalla("transacciones")}
          onSave={handleGuardar}
        />
      );

    case "editar":
      return (
        <Editar
          item={transaccionEdit}
          onNext={() => setPantalla("eliminar")}
          onBack={() => setPantalla("transacciones")}
          onUpdate={handleActualizar}
        />
      );

    case "eliminar":
      return (
        <Eliminar
          onBack={() => setPantalla("editar")}
          onConfirm={handleEliminarDefinitivo}
        />
      );

    default:
      return null;
  }
}
