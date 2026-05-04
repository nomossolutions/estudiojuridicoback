import { Router } from "express";
import { borrarCitaId, crearCita, editarCitaId, listarCita, listarCitaId } from "../controllers/cita.controllers.js";
import validacionCita from "../middlewares/validarCita.js";
import validarId from "../middlewares/validarIds.js";
import verificarJWT from "../middlewares/verificarJWT.js";


const router = Router();

router.route("/").post([verificarJWT,validacionCita],crearCita).get([verificarJWT], listarCita);
router.route("/:id").get(validarId, listarCitaId).delete([verificarJWT,validarId], borrarCitaId).put([verificarJWT,validarId, validacionCita],editarCitaId);

export default router;