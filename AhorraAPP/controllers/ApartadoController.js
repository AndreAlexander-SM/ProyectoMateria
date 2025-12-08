import { insertApartado, getApartados, deleteApartadoDB, updateApartadoDB } from "../database/Database";
import { Apartado } from "../models/Apartado";

export class ApartadoController {
  async crear(usuarioId, nombre, monto, mes, categoria, descripcion) {
    const montoLimpio = parseFloat(monto.toString().replace("$", "").replace(",", ""));

    try {
      await insertApartado(usuarioId, nombre, montoLimpio, mes, categoria, descripcion);
      return true;
    } catch (e) {
      return false;
    }
  }

  async obtenerTodos(usuarioId) {
    try {
      const data = await getApartados(usuarioId);
      return data.map(
        a => new Apartado(a.id, a.nombre, a.monto, a.mes, a.categoria, a.descripcion)
      );
    } catch (e) {
      return [];
    }
  }

  async actualizar(id, nombre, monto, mes, categoria) {
    const montoLimpio = parseFloat(monto.toString().replace("$", "").replace(",", ""));

    try {
      await updateApartadoDB(id, nombre, montoLimpio, mes, categoria);
      return true;
    } catch (e) {
      return false;
    }
  }

  async eliminar(id) {
    try {
      await deleteApartadoDB(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  async obtenerTotalAhorrado(usuarioId) {
    try {
      const apartados = await this.obtenerTodos(usuarioId);

      const total = apartados.reduce((acc, item) => acc + item.monto, 0);

      return total;
    } catch (e) {
      return 0;
    }
  }
}
