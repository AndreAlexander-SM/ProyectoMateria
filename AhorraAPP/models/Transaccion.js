export class Transaccion {
    constructor(id, monto, categoria, fecha, descripcion, tipo) {
        this.id = id;
        this.monto = monto;
        this.categoria = categoria;
        this.fecha = fecha;
        this.descripcion = descripcion;
        this.tipo = tipo; // 'ingreso' o 'gasto'
    }
}