import { Router } from 'express';
import { obtenerJuicio, crearJuicio, obtenerJuicioPorId, eliminarJuicio, actualizarJuicio, descargarJuicio } from '../controllers/juicio.controllers.js';
import validacionJuicio from "../middlewares/validarJuicio.js";
import validarId from "../middlewares/validarIds.js";
import verficarJWT from '../middlewares/verificarJWT.js';
import multer from "multer";

const router = Router();
const upload = multer({dest:"uploads/"});

// Importar los controladores

router.route('/').get(obtenerJuicio).post([verficarJWT,upload.single("seleccionarArchivo"), validacionJuicio],crearJuicio);
router.route('/:id').get(validarId,obtenerJuicioPorId).delete([verficarJWT, validarId],eliminarJuicio).put([verficarJWT,validarId, upload.single("seleccionarArchivo"), validacionJuicio], actualizarJuicio);
router.get("/:id/descargar", [verficarJWT, validarId], descargarJuicio)
export default router;
