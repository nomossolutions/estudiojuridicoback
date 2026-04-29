import { Router } from "express";
import { borrarCitaId, crearCita, editarCitaId, listarCita, listarCitaId } from "../controllers/cita.controllers.js";
import validacionCita from "../middlewares/validarCita.js";
import validarId from "../middlewares/validarIds.js";
import verficarJWT from "../middlewares/verificarJWT.js";


const router = Router();

router.route("/").post([verficarJWT,validacionCita],crearCita).get(listarCita);
router.route("/:id").get(listarCitaId).delete([verficarJWT,validarId], borrarCitaId).put([verficarJWT,validarId, validacionCita],editarCitaId);

export default router;