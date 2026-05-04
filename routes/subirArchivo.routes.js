import { Router } from "express";
import { crearSubirArchivo,listaSubirArchivo,obtenerSubirArchivoPorId,eliminarSubirArchivo,editarSubirArchivo,descargarSubirArchivo} from "../controllers/subirArchivo.controllers.js";
import validarSubirArchivo from '../middlewares/validarSubirArchivo.js';
import validarIds from "../middlewares/validarIds.js"
import verificarJWT from "../middlewares/verificarJWT.js";
import multer from "multer";

const router = Router();
const upload = multer({dest:"uploads/"});

router.route("/").post([verificarJWT,upload.single("seleccionarArchivo"),validarSubirArchivo], crearSubirArchivo).get([verificarJWT], listaSubirArchivo);
router.route("/:id").get(validarIds, obtenerSubirArchivoPorId).delete([verificarJWT,validarIds], eliminarSubirArchivo).put([verificarJWT,upload.single("seleccionarArchivo"),validarIds, validarSubirArchivo], editarSubirArchivo);
router.route("/:id/descargar").get([verificarJWT, validarIds], descargarSubirArchivo);



export default router;
