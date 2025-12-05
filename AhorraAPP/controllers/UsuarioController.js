import {
  insertUsuario,
  loginUsuario,
  updatePasswordByEmail,
} from "../database/Database";
import { Usuario } from "../models/Usuario";

export class UsuarioController {
  static usuarioActivo = null;

  async registrar(nombre, email, password, telefono) {
    try {
      await insertUsuario(nombre, email.toLowerCase(), password, telefono);
      return { success: true };
    } catch (e) {
      return { success: false, msg: "Este correo ya está registrado." };
    }
  }

  async validarLogin(email, password) {
    const data = await loginUsuario(email.toLowerCase(), password);

    if (data) {
      const user = new Usuario(
        data.id,
        data.nombre,
        data.email,
        data.password,
        data.telefono
      );

      UsuarioController.usuarioActivo = user;
      return user;
    }

    return null;
  }

  async recuperarPassword(email, nuevaPassword) {
    try {
      const res = await updatePasswordByEmail(
        email.toLowerCase(),
        nuevaPassword
      );
      return res.changes > 0;
    } catch (e) {
      return false;
    }
  }

  getUsuarioActivo() {
    return UsuarioController.usuarioActivo;
  }

  cerrarSesion() {
    UsuarioController.usuarioActivo = null;
  }
}
