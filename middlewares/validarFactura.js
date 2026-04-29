import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

const validarFactura = [
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

  body("nombreCliente")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio")
    .isLength({ min: 10, max: 30 })
    .withMessage("El nombre del cliente debe tener entre 10 a 30 caracteres "),

  body("concepto")
    .notEmpty()
    .withMessage("El concepto es obligatorio")
    .isLength({ min: 15, max: 50 })
    .withMessage("El concepto debe tener entre 15 a 50 caracteres "),

  body("monto")
    .notEmpty()
    .withMessage("El monto es obligatorio")
    .custom((valor) => {
      if (isNaN(valor) || valor <= 0) {
        throw new Error("El monto debe ser un numero valido mayor a 0");
      }
      return true;
    }),
  body("estado")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isIn(["Pendiente", "Pagada", "Anulada"]),

  (req, res, next) => resultadoValidacion(req, res, next),
];
export default validarFactura;
