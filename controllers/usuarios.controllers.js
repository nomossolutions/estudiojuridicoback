import generarJWT from "../middlewares/generarJWT.js";
import Usuario from "../models/usuario.js";
import bcrypt from "bcrypt";

//POST
export const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json({
      message: "Usuario creado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en el servidor al crear el usuario",
    });
  }
};

//GET
export const obtenerUsuarios = async (req, res) => {
  try {
    const { role, search } = req.query;
    const filtro = {};
    if (role) {
      filtro.role = role;
    }
    if (search) {
      filtro.$or = [
        { nombre: { $regex: search, $options: "i" } },
        { apellido: { $regex: search, $options: "i" } },
      ];
    }
    const usuarios = await Usuario.find(filtro).select("-password");
    res.status(200).json(usuarios);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error en el servidor al obtener los usuarios",
    });
  }
};

//GET by ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuariosporID = await Usuario.findById(req.params.id).select("-password");
    if (!usuariosporID) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
    res.status(200).json(usuariosporID);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error en el servidor al obtener el usuario por ID",
    });
  }
};

// DeLETE
export const eliminarUsuario = async (req, res) => {
  try {
    const usuarioBorrado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioBorrado) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
    res.status(200).json({
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error en el servidor al eliminar el usuario",
    });
  }
};

//UPDATE

export const actualizarUsuario = async (req, res) => {
  try {
    const datosActualizados = { ...req.body };

    if (datosActualizados.password) {
      const saltos = bcrypt.genSaltSync(10);
      datosActualizados.password = bcrypt.hashSync(
        datosActualizados.password,
        saltos
      );
    }else{
      delete datosActualizados.password;
    }
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true, runValidators: true }
    );
    if (!usuarioActualizado) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
    res.status(200).json({
      message: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error en el servidor al actualizar el usuario",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }
    
    const usuarioBuscado = await Usuario.findOne({
      email: email,
    });
    if (!usuarioBuscado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const passwordCorrecto = bcrypt.compareSync(
      password,
      usuarioBuscado.password
    );
    if (!passwordCorrecto) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
    const token = generarJWT(usuarioBuscado._id, usuarioBuscado.email, usuarioBuscado.role);
    console.log(usuarioBuscado);
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token: token,
      nombre: usuarioBuscado.nombre,
      role: usuarioBuscado.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el login del usuario" });
  }
};
