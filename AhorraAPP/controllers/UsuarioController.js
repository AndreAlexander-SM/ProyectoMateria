import { insertUsuario, loginUsuario } from "../database/Database";
import { Usuario } from "../models/Usuario";

export class UsuarioController {
  static usuarioActivo = null;

  async registrar(nombre, email, password, telefono) {
    if (!email || !password) {
      return { success: false, msg: "Faltan datos obligatorios." };
    }

    try {
      await insertUsuario(nombre, email.toLowerCase(), password, telefono);
      return { success: true };
    } catch (error) {
      return { success: false, msg: "El correo ya existe." };
    }
  }

  async validarLogin(email, password) {
    try {
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
    } catch (error) {
      return null;
    }
  }

  getUsuarioActivo() {
    return UsuarioController.usuarioActivo;
  }

  cerrarSesion() {
    UsuarioController.usuarioActivo = null;
  }
}
