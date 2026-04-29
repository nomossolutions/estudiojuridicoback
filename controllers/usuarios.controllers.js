import generarJWT from "../middlewares/generarJWT.js";
import Usuario from "../models/usuario.js";
import bcrypt from "bcrypt";

//POST
export const crearUsuario = async (req, res) => {
  try {
    const saltos = bcrypt.genSaltSync(10);
    const passwordEncriptada = bcrypt.hashSync(
      req.body.formBasicPassword,
      saltos
    );
    req.body.formBasicPassword = passwordEncriptada;
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
    const usuarios = await Usuario.find(filtro);
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
    const usuariosporID = await Usuario.findById(req.params.id);
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
    const usurioBorrado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usurioBorrado) {
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

    if (datosActualizados.formBasicPassword) {
      const saltos = bcrypt.genSaltSync(10);
      datosActualizados.formBasicPassword = bcrypt.hashSync(
        datosActualizados.formBasicPassword,
        saltos
      );
    }else{
      delete datosActualizados.formBasicPassword;
    }
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true }
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
    const { email, formBasicPassword } = req.body;
    const usuarioBuscado = await Usuario.findOne({
      email: email,
    });
    if (!usuarioBuscado) {
      return res.status(404).send("Usario no encontrado");
    }
    const passwordCorrecto = bcrypt.compareSync(
      formBasicPassword,
      usuarioBuscado.formBasicPassword
    );
    if (!passwordCorrecto) {
      return res.status(401).send("Credenciales incorrectas");
    }
    const token = await generarJWT(usuarioBuscado, passwordCorrecto);
    console.log(usuarioBuscado);
    res.status(200).json({
      mensaje: "Logeo exitoso",
      token: token,
      nombre: usuarioBuscado.nombre,
      role: usuarioBuscado.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el login del usuario");
  }
};
