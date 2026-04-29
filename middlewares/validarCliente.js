import { body } from "express-validator";
import  Cliente  from "../models/cliente.js";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionCliente = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio")
    .isLength({ min: 4, max: 30 }),
  body("identificador")
    .notEmpty()
    .withMessage("El dni o cuil del cliente es obligatorio")
    .custom((value) => {
      const limpio = value.replace(/-/g, "");
      const soloNumeros = /^\d{7,11}$/.test(limpio);
      if (!soloNumeros) {
        throw new Error("Debe contener solo números (7 a 11 dígitos)");
      }
      if (limpio.length === 11) {
        const coef = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        let suma = 0;
        for (let i = 0; i < 10; i++) {
          suma += parseInt(limpio[i]) * coef[i];
        }
        const verificador = 11 - (suma % 11);
        if (verificador !== parseInt(limpio[10])) {
          throw new Error("CUIT/CUIL inválido");
        }
      }
      return true;
    })
    .custom(async (valor, { req }) => {
      const existeIdentificador = await Cliente.findOne({
        identificador: valor,
      });
      if (!existeIdentificador) {
        return true;
      }

      if (
        req.params.id &&
        req.params.id.toString() === existeIdentificador._id.toString()
      ) {
        return true;
      }
      throw new Error(
        "Ya existe un cliente con este DNI/CUIL y no puede ser duplicado"
      );
    }),
  body("email")
    .notEmpty()
    .withMessage("El email del cliente es obligatorio")
    .isEmail()
    .withMessage("el email del cliente debe tener un formato valido")
       .custom(async (valor, {req}) =>{
        const existeEmail = await Cliente.findOne({
            email: valor
        })
        if(!existeEmail){
            return true
        }
        if(req.params.id && req.params.id.toString() === existeEmail._id.toString()){
            return true
        } 
        throw new Error ("Ya existe un cliente registrado con ese email, no pueden ser duplicados")
    }),
  body("telefono")
    .notEmpty()
    .withMessage("El telefono del cliente es obligatorio")
    .matches(/^\d+$/)
    .withMessage("Solo se permiten números")
    .isLength({ min: 7, max: 15 })
    .withMessage("El teléfono debe tener entre 7 y 15 dígitos"),
    body("estadoCliente")
    .notEmpty()
    .withMessage("El estado del cliente es obligatorio")
    .isIn(["Activo", "Inactivo"])
    .withMessage("El estado del cliente debe ser una de las sigueintes Activo,Inactivo"),

    (req, res, next) => resultadoValidacion(req, res, next)
];

export default validacionCliente