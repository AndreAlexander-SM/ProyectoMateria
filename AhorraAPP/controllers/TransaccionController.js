import {
  insertTransaccion,
  getTransacciones,
  deleteTransaccionDB,
  updateTransaccion,
} from "../database/Database";

import { Transaccion } from "../models/Transaccion";

export class TransaccionController {
  async agregar(usuarioId, monto, categoria, fecha, descripcion, tipo) {
    const montoLimpio = parseFloat(
      monto.toString().replace("$", "").replace(",", "")
    );

    try {
      await insertTransaccion(
        usuarioId,
        montoLimpio,
        categoria,
        fecha,
        descripcion,
        tipo
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async obtenerTodas(usuarioId) {
    try {
      const data = await getTransacciones(usuarioId);

      return data.map(
        (t) =>
          new Transaccion(
            t.id,
            t.monto,
            t.categoria,
            t.fecha,
            t.descripcion,
            t.tipo
          )
      );
    } catch (e) {
      return [];
    }
  }

  async editar(id, monto, categoria, fecha, descripcion, tipo) {
    const montoLimpio = parseFloat(
      monto.toString().replace("$", "").replace(",", "")
    );

    try {
      await updateTransaccion(
        id,
        montoLimpio,
        categoria,
        fecha,
        descripcion,
        tipo
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async eliminar(id) {
    try {
      await deleteTransaccionDB(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  async obtenerBalance(usuarioId) {
    const transacciones = await this.obtenerTodas(usuarioId);

    let ingresos = 0;
    let gastos = 0;

    transacciones.forEach((t) => {
      if (t.tipo === "ingreso") ingresos += t.monto;
      if (t.tipo === "gasto") gastos += Math.abs(t.monto);
    });

    return {
      ingresos,
      gastos,
      total: ingresos - gastos,
    };
  }

  async obtenerDatosGrafica(usuarioId) {
    const transacciones = await this.obtenerTodas(usuarioId);
    const gastosPorCategoria = {};

    transacciones
      .filter((t) => t.tipo === "gasto")
      .forEach((t) => {
        if (gastosPorCategoria[t.categoria]) {
          gastosPorCategoria[t.categoria] += Math.abs(t.monto);
        } else {
          gastosPorCategoria[t.categoria] = Math.abs(t.monto);
        }
      });

    return gastosPorCategoria;
  }
}
