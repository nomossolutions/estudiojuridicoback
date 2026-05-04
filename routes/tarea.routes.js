import { Router } from "express";
import { actualizarTareaPorID, borrarTareaPorID, crearTarea, listarTarea, listarTareaPorID } from "../controllers/tareas.controllers.js";
import validacionTarea from "../middlewares/validarTarea.js";
import validarId from "../middlewares/validarIds.js";
import verificarJWT from "../middlewares/verificarJWT.js";

const router = Router();

router.route("/").post([verificarJWT,validacionTarea] ,crearTarea).get([verificarJWT],listarTarea);
router.route("/:id").get(validarId ,listarTareaPorID).delete([verificarJWT,validarId], borrarTareaPorID).put([verificarJWT,validarId, validacionTarea], actualizarTareaPorID);

export default router;