import * as SQLite from "expo-sqlite";

const DB_NAME = "ahorraplus_final_v4.db";

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
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY NOT NULL,
      nombre TEXT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      telefono TEXT
    );
  `);

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

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS presupuestos (
      id INTEGER PRIMARY KEY NOT NULL,
      usuario_id INTEGER,
      nombre TEXT,
      categoria TEXT,
      mes TEXT,
      monto_limite REAL
    );
  `);
};

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

export const updatePasswordByEmail = async (email, newPassword) => {
  const db = await getDB();
  return await db.runAsync(
    "UPDATE usuarios SET password = ? WHERE email = ?;",
    [newPassword, email]
  );
};

export const insertTransaccion = async (usuarioId, monto, categoria, fecha, descripcion, tipo) => {
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

export const deleteTransaccionDB = async (id) => {
  const db = await getDB();
  return await db.runAsync("DELETE FROM transacciones WHERE id = ?;", [id]);
};

export const updateTransaccion = async (id, monto, categoria, fecha, descripcion, tipo) => {
  const db = await getDB();
  return await db.runAsync(
    "UPDATE transacciones SET monto = ?, categoria = ?, fecha = ?, descripcion = ?, tipo = ? WHERE id = ?;",
    [monto, categoria, fecha, descripcion, tipo, id]
  );
};

export const insertPresupuesto = async (usuarioId, nombre, categoria, mes, monto) => {
  const db = await getDB();
  return await db.runAsync(
    "INSERT INTO presupuestos (usuario_id, nombre, categoria, mes, monto_limite) VALUES (?, ?, ?, ?, ?);",
    [usuarioId, nombre, categoria, mes, monto]
  );
};

export const getPresupuestos = async (usuarioId) => {
  const db = await getDB();
  return await db.getAllAsync(
    "SELECT * FROM presupuestos WHERE usuario_id = ?;",
    [usuarioId]
  );
};

export const deletePresupuestoDB = async (id) => {
  const db = await getDB();
  return await db.runAsync(
    "DELETE FROM presupuestos WHERE id = ?;",
    [id]
  );
};

export const updatePresupuestoDB = async (id, nombre, categoria, mes, monto) => {
  const db = await getDB();
  return await db.runAsync(
    "UPDATE presupuestos SET nombre = ?, categoria = ?, mes = ?, monto_limite = ? WHERE id = ?;",
    [nombre, categoria, mes, monto, id]
  );
};
