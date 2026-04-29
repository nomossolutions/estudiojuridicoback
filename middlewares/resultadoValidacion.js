import {validationResult} from "express-validator";

const resultadoValidacion = (req, res, next) =>{
    const errorDeValidacion = validationResult(req);
    if(!errorDeValidacion.isEmpty()){
        return res.status(400).json(errorDeValidacion.array());
    } next();
}

export default resultadoValidacion;