import {body} from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";
import Usuario from "../models/usuario.js";
import Cita from "../models/cita.js";
import mongoose from "mongoose";


const validacionCita = [
    body("fecha")
    .notEmpty()
    .withMessage("La fecha de la cita es obligatoria")
    .custom((valor) => {
        const fecha = new Date(valor);
         const day = fecha.getDay();
         if(day <1  || day>5  ){
            throw new Error(
                `El dia ${fecha.toDateString()} no es un dia habil`
            );
         }
         return true;
    }),
    body("hora")
    .notEmpty()
    .withMessage("La hora de la cita es obligatoria")
    .isIn([
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
    ])
    .withMessage("La hora seleccionada no es valida"),
    body("cliente")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio")
    .isLength({min:10, max:30})
    .withMessage("El nombre del cliente debe tener entre 10 a 30 caracteres "),
    body("abogado")
    .notEmpty()
    .withMessage("El nombre del abogado es obligatorio")
    .custom(async(valor, {req})=>{
        if(!mongoose.Types.ObjectId.isValid(valor)){
            throw new Error("El ID del abogado no es valido")
        }
        const abogado = await Usuario.findById(valor).select("role");
        if(!abogado){
            throw new Error ("El abogado no existe en la base de datos")
        }

        if(abogado.role !== "abog"){
            throw new Error ("El usuario seleccionado no tiene rol de abogado")
        }
        req.abogNombre = abogado.nombre;
        return true;
    })
    .custom(async(valor, {req})=>{
        const existe = await Cita.findOne({
            abogado: valor,
            fecha: req.body.fecha,
            hora: req.body.hora,
            _id: { $ne: req.params.id }
        });

        if(existe){
            throw new Error(
                `El abogado ${req.abogNombre} ya tiene una ccita registrada el ${req.body.fecha} a la hora
                ${req.body.hora}`
            )
        }
        return true;
    }),
    body("tipoEvento")
    .notEmpty()
    .withMessage("El nombre del evento es obligatorio")
    .isIn(["Consulta", "Audiencia", "Reunion"]),
    body("notas")
    .notEmpty()
    .withMessage("La nota es obligatoria")
    .isLength({min: 10, max:300})
    .withMessage("La nota debe contener como minimo 10 caracteres y como maximo 300 caracteres")
    .trim(),

    (req, res, next) => resultadoValidacion(req, res, next),
]

export default validacionCita; 
