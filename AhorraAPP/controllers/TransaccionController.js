import { insertTransaccion, getTransacciones, deleteTransaccionDB, updateTransaccion, getPresupuestos } from "../database/Database";
import { Transaccion } from "../models/Transaccion";

export class TransaccionController {
  async agregar(usuarioId, monto, categoria, fecha, descripcion, tipo) {
    const montoString = monto ? monto.toString() : "0";

    const montoLimpio = parseFloat(
      montoString.replace("$", "").replace(",", "").trim()
    );

    if (!montoLimpio || isNaN(montoLimpio) || montoLimpio === 0) {
      console.log("Intento de guardar transacción vacía o cero bloqueado.");
      return { success: false, alerta: false };
    }

    try {
      await insertTransaccion(usuarioId, montoLimpio, categoria, fecha, descripcion, tipo);

      if (tipo === "gasto") {
        const presupuestos = await getPresupuestos(usuarioId);

        const presupuestoEncontrado = presupuestos.find(
          p => p.categoria.toLowerCase().trim() === categoria.toLowerCase().trim()
        );

        if (presupuestoEncontrado) {
          const transacciones = await getTransacciones(usuarioId);
          let totalGastado = 0;

          transacciones.forEach(t => {
            if (t.tipo === "gasto" && t.categoria.toLowerCase().trim() === categoria.toLowerCase().trim()) {
              totalGastado += t.monto;
            }
          });

          if (totalGastado > presupuestoEncontrado.monto_limite) {
            return {
              success: true,
              alerta: true,
              limite: presupuestoEncontrado.monto_limite,
              total: totalGastado
            };
          }
        }
      }

      return { success: true, alerta: false };
    } catch (e) {
      console.log(e);
      return { success: false, alerta: false };
    }
  }

  async obtenerTodas(usuarioId) {
    try {
      const data = await getTransacciones(usuarioId);

      return data
        .filter(t => t.monto !== 0)
        .map(t => new Transaccion(t.id, t.monto, t.categoria, t.fecha, t.descripcion, t.tipo));
    } catch (e) {
      return [];
    }
  }

  async editar(id, monto, categoria, fecha, descripcion, tipo) {
    const montoString = monto ? monto.toString() : "0";
    const montoLimpio = parseFloat(montoString.replace("$", "").replace(",", ""));

    if (!montoLimpio || montoLimpio === 0) return false;

    try {
      await updateTransaccion(id, montoLimpio, categoria, fecha, descripcion, tipo);
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

    transacciones.forEach(t => {
      const valor = parseFloat(t.monto);

      if (t.tipo === "ingreso") ingresos += valor;
      if (t.tipo === "gasto") gastos += Math.abs(valor);
    });

    return { ingresos, gastos, total: ingresos - gastos };
  }

  async obtenerDatosGrafica(usuarioId) {
    const transacciones = await this.obtenerTodas(usuarioId);
    const gastosPorCategoria = {};

    transacciones
      .filter(t => t.tipo === "gasto")
      .forEach(t => {
        const valor = Math.abs(parseFloat(t.monto));

        if (gastosPorCategoria[t.categoria]) {
          gastosPorCategoria[t.categoria] += valor;
        } else {
          gastosPorCategoria[t.categoria] = valor;
        }
      });

    return gastosPorCategoria;
  }
}
