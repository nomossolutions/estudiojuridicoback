import {body} from "express-validator"
import resultadoValidacion from "./resultadoValidacion.js";

const validacionJuicio = [
    body("nombreCliente")
        .notEmpty()
        .withMessage("El nombre del usuario es obligatorio")
        .isLength({ min: 4, max: 30 })
        .withMessage("El nombre del usuario debe tener entre 4 y 30 caracteres"),

    body("nombreDeJuicio")
        .notEmpty()
        .withMessage("El del caso es obligatorio")
        .isLength({ min: 4, max: 100 })
        .withMessage("El nombre del caso debe tener entre 4 y 100 caracteres"),

    body("numeroExpediente")
        .notEmpty()
        .withMessage("El número de expediente es obligatorio")
        .matches(/^\d+$/)
        .withMessage("Solo se permiten números")
        .isLength({ min: 1, max: 15 })
        .withMessage("El número de expediente debe tener entre 1 y 15 dígitos"),

    body("juzgado")
        .notEmpty()
        .withMessage("El nombre del juzgado es obligatorio")
        .isLength({ min: 4, max: 50 })
        .withMessage("El nombre del caso debe tener entre 4 y 50 caracteres"),

    body("fecha")
        .notEmpty()
        .withMessage("La fecha de la cita es obligatoria")
        .custom((valor) => {
            const fecha = new Date(valor);
            const day = fecha.getDay();
            if (day < 1 || day > 5) {
                throw new Error(
                    `El día ${fecha.toDateString()} no es un día hábil`
                );
            }
            return true;
        }),

    (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionJuicio;
