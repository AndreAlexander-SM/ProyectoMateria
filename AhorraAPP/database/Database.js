import * as SQLite from "expo-sqlite";

const DB_NAME = "ahorraplus_final_v2.db"; 
let dbInstance = null;

const getDB = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    await dbInstance.execAsync("PRAGMA journal_mode = WAL;");
    await initTables(dbInstance);
  }
  return dbInstance;
};

const initTables = async (db) => {
  // 1. Usuarios
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY NOT NULL,
      nombre TEXT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      telefono TEXT
    );
  `);

  // 2. Transacciones
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transacciones (
      id INTEGER PRIMARY KEY NOT NULL,
      usuario_id INTEGER,
      monto REAL,
      categoria TEXT,
      fecha TEXT,
      descripcion TEXT,
      tipo TEXT
    );
  `);

  // 3. Apartados
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS apartados (
      id INTEGER PRIMARY KEY NOT NULL,
      usuario_id INTEGER,
      nombre TEXT,
      monto REAL,
      mes TEXT,
      categoria TEXT,
      descripcion TEXT
    );
  `);

  // --- DATOS DE PRUEBA AUTOMÁTICOS ---
  const conteo = await db.getFirstAsync(
    "SELECT count(*) as count FROM transacciones"
  );

  if (conteo.count === 0) {
    console.log("Insertando datos semilla para lucirnos... ✨");

    await db.runAsync(`
      INSERT INTO transacciones 
      (usuario_id, monto, categoria, fecha, descripcion, tipo) 
      VALUES
        (1, 12500.00, 'Salario', '28 de Noviembre de 2025', 'Nómina Quincenal', 'ingreso'),
        (1, 3500.00, 'Freelance', '25 de Noviembre de 2025', 'Diseño Web', 'ingreso'),
        (1, -4500.00, 'Renta', '01 de Noviembre de 2025', 'Pago departamento', 'gasto'),
        (1, -1200.50, 'Comida', '15 de Noviembre de 2025', 'Supermercado semanal', 'gasto'),
        (1, -800.00, 'Servicios', '10 de Noviembre de 2025', 'Luz e Internet', 'gasto'),
        (1, -600.00, 'Entretenimiento', '20 de Noviembre de 2025', 'Cine VIP y Cena', 'gasto'),
        (1, -350.00, 'Transporte', '22 de Noviembre de 2025', 'Gasolina', 'gasto'),
        (1, -1200.00, 'Ropa', '27 de Noviembre de 2025', 'Estreno fin de año', 'gasto'),
        (1, -150.00, 'Otros', '28 de Noviembre de 2025', 'Café y snacks', 'gasto');
    `);

    await db.runAsync(`
      INSERT INTO apartados 
      (usuario_id, nombre, monto, mes, categoria, descripcion) 
      VALUES
        (1, 'Vacaciones', 5000, 'Diciembre', 'Personal', 'Ahorro para la playa'),
        (1, 'Aguinaldo', 2000, 'Diciembre', 'Hogar', 'Regalos de navidad');
    `);
  }
};

// --- EXPORTS ---

export const insertUsuario = async (nombre, email, password, telefono) => {
  const db = await getDB();
  return await db.runAsync(
    "INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?);",
    [nombre, email, password, telefono]
  );
};

export const loginUsuario = async (email, password) => {
  const db = await getDB();
  return await db.getFirstAsync(
    "SELECT * FROM usuarios WHERE email = ? AND password = ?;",
    [email, password]
  );
};

// --- TRANSACCIONES ---

export const insertTransaccion = async (
  usuarioId,
  monto,
  categoria,
  fecha,
  descripcion,
  tipo
) => {
  const db = await getDB();
  return await db.runAsync(
    "INSERT INTO transacciones (usuario_id, monto, categoria, fecha, descripcion, tipo) VALUES (?, ?, ?, ?, ?, ?);",
    [usuarioId, monto, categoria, fecha, descripcion, tipo]
  );
};

export const getTransacciones = async (usuarioId) => {
  const db = await getDB();
  return await db.getAllAsync(
    "SELECT * FROM transacciones WHERE usuario_id = ? ORDER BY id DESC;",
    [usuarioId]
  );
};

export const updateTransaccion = async (
  id,
  monto,
  categoria,
  fecha,
  descripcion,
  tipo
) => {
  const db = await getDB();
  return await db.runAsync(
    "UPDATE transacciones SET monto = ?, categoria = ?, fecha = ?, descripcion = ?, tipo = ? WHERE id = ?;",
    [monto, categoria, fecha, descripcion, tipo, id]
  );
};

export const deleteTransaccionDB = async (id) => {
  const db = await getDB();
  return await db.runAsync(
    "DELETE FROM transacciones WHERE id = ?;",
    [id]
  );
};

// --- APARTADOS ---

export const insertApartado = async (
  usuarioId,
  nombre,
  monto,
  mes,
  categoria,
  descripcion
) => {
  const db = await getDB();
  return await db.runAsync(
    "INSERT INTO apartados (usuario_id, nombre, monto, mes, categoria, descripcion) VALUES (?, ?, ?, ?, ?, ?);",
    [usuarioId, nombre, monto, mes, categoria, descripcion]
  );
};

export const getApartados = async (usuarioId) => {
  const db = await getDB();
  return await db.getAllAsync(
    "SELECT * FROM apartados WHERE usuario_id = ? ORDER BY id DESC;",
    [usuarioId]
  );
};

export const deleteApartadoDB = async (id) => {
  const db = await getDB();
  return await db.runAsync(
    "DELETE FROM apartados WHERE id = ?;",
    [id]
  );
};

export const updateApartadoDB = async (
  id,
  nombre,
  monto,
  mes,
  categoria
) => {
  const db = await getDB();
  return await db.runAsync(
    "UPDATE apartados SET nombre = ?, monto = ?, mes = ?, categoria = ? WHERE id = ?;",
    [nombre, monto, mes, categoria, id]
  );
};
