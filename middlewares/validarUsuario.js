import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";
import Usuario from "../models/usuario.js";

const validacionUsuario = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del usuario es obligatorio")
    .isLength({ min: 4, max: 30 })
    .withMessage("El nombre del usuario debe tener entre 4 y 30 caracteres"),
  body("apellido")
    .notEmpty()
    .withMessage("El apellido del usuario es obligatorio")
    .isLength({ min: 4, max: 30 })
    .withMessage("El apellido del usuario debe tener entre 4 y 30 caracteres"),
  body("email")
    .notEmpty()
    .withMessage("El email del usuario es obligatorio")
    .isEmail()
    .withMessage("El email del usuario debe tener un formato valido")
    .custom(async (valor, { req }) => {
      const existeEmail = await Usuario.findOne({
        email: valor,
      });
      if (!existeEmail) {
        return true;
      }
      if (
        req.params.id &&
        req.params.id.toString() === existeEmail._id.toString()
      ) {
        return true;
      }
      throw new Error(
        "Ya existe un usuario registrado con ese email, no pueden ser duplicados"
      );
    }),
  body("telefono")
    .notEmpty()
    .withMessage("El telefono del cliente es obligatorio")
    .matches(/^\d+$/)
    .withMessage("Solo se permiten números")
    .isLength({ min: 7, max: 15 })
    .withMessage("El teléfono debe tener entre 7 y 15 dígitos"),
  body("formBasicPassword")
    .if((value, { req }) => req.method === "POST")
    .notEmpty()
    .withMessage("La contraseña del usuario es obligatoria")
    .matches(
      /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/
    )
    .withMessage(
      "La contrasela debe incluir mayúsculas, minúsculas, número y carácteres especiales y tener entre 8 a 16 caracteres"
    ),
  body("role")
    .notEmpty()
    .withMessage("EL rol del usuario es obligatorio")
    .isIn(["admin", "secre", "abog"]),

  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionUsuario;
