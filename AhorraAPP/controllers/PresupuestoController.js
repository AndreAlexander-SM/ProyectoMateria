import { insertPresupuesto, getPresupuestos, deletePresupuestoDB, updatePresupuestoDB } from "../database/Database";

export class PresupuestoController {
  async crear(usuarioId, nombre, categoria, mes, monto) {
    const montoLimpio = parseFloat(monto.toString().replace("$", "").replace(",", ""));

    try {
      await insertPresupuesto(usuarioId, nombre, categoria, mes, montoLimpio);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async obtenerTodos(usuarioId) {
    try {
      const datos = await getPresupuestos(usuarioId);

      return datos.map(p => ({
        id: p.id.toString(),
        nombre: p.nombre,
        categoria: p.categoria,
        mes: p.mes,
        monto: `$${p.monto_limite.toFixed(2)}`,
        monto_limite: p.monto_limite
      }));
    } catch (e) {
      return [];
    }
  }

  async editar(id, nombre, categoria, mes, monto) {
    const montoLimpio = parseFloat(monto.toString().replace("$", "").replace(",", ""));

    try {
      await updatePresupuestoDB(id, nombre, categoria, mes, montoLimpio);
      return true;
    } catch (e) {
      return false;
    }
  }

  async eliminar(id) {
    try {
      await deletePresupuestoDB(id);
      return true;
    } catch (e) {
      return false;
    }
  }
}
