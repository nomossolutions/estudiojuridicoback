import { param } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";


const validarId = [
    param("id")
    .isMongoId()
    .withMessage("El id no es un id valido de mongodb"),
    (req, res, next) => resultadoValidacion(req, res, next),
]

export default validarId; 