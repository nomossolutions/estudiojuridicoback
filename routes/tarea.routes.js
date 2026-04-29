import { Router } from "express";
import { actualizarTareaPorID, borrarTareaPorID, crearTarea, listarTarea, listarTareaPorID } from "../controllers/tareas.controllers.js";
import validacionTarea from "../middlewares/validarTarea.js";
import validarId from "../middlewares/validarIds.js";
import verficarJWT from "../middlewares/verificarJWT.js";

const router = Router();

router.route("/").post([verficarJWT,validacionTarea] ,crearTarea).get(listarTarea);
router.route("/:id").get(validarId ,listarTareaPorID).delete([verficarJWT,validarId], borrarTareaPorID).put([verficarJWT,validarId, validacionTarea], actualizarTareaPorID);

export default router;