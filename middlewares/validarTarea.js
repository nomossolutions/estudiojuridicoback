import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";
import Usuario from "../models/usuario.js";
import Tarea from "../models/tarea.js";
import mongoose from "mongoose";

const validacionTarea = [
  body("descripcion")
    .notEmpty()
    .withMessage("La descripción de la tarea es obligatoria")
    .isLength({ min: 10, max: 1000 })
    .withMessage("La descripción debe tener entre 10 y 1000 caracteres"),
  body("abogado")
    .notEmpty()
    .withMessage("El responsable es obligatorio")
    .custom(async (valor, { req }) => {
      if (!mongoose.Types.ObjectId.isValid(valor)) {
        throw new Error("El ID del abogado no es valido");
      }
      const abogado = await Usuario.findById(valor).select("role");
      if (!abogado) {
        throw new Error("El abogado no existe en la base de datos");
      }

      if (abogado.role !== "abog") {
        throw new Error("El usuario seleccionado no tiene rol de abogado");
      }
      req.abogNombre = abogado.nombre;
      return true;
    }),
  body("fecha")
    .notEmpty()
    .withMessage("La fecha de la tarea es obligatoria")
    .custom((valor) => {
      const fecha = new Date(valor);
      if (isNaN(fecha)) {
        throw new Error("La fecha no es válida");
      }
      return true;
    }),
  body("prioridad")
    .notEmpty()
    .withMessage("La prioridad de la tarea es obligatoria")
    .isIn(["alta", "media", "baja"]),
  body("estado")
    .notEmpty()
    .withMessage("El estado de la tarea es obligatoria")
    .isIn(["Pendiente", "Proceso", "Completada", "Cancelada", "Reprogramada"])
    .withMessage("El estado debe ser uno de: Pendiente, Proceso, Completada, Cancelada, Reprogramada"),

  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionTarea;
