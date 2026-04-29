import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

const validarSubirArchivos = [
  body("nombreCliente")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio")
    .isLength({ min: 10, max: 50 })
    .withMessage("El nombre del cliente debe tener entre 10 y 50 caracteres"),

  body("tipodearchivo")
    .notEmpty()
    .withMessage("El tipo de archivo es obligatorio")
    .isIn(["demanda", "contrato", "escrito", "poder", "notificacion"]),

  body("fecha")
    .notEmpty()
    .withMessage("La fecha es obligatoria")
    .custom((valor) => {
      const fecha = new Date(valor);
      if (isNaN(fecha)) {
        throw new Error("La fecha no es válida");
      }
      return true;
    }),

  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validarSubirArchivos;
