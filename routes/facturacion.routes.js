import { Router } from "express";
import {crearFacturacion, editarFacturacion, eliminarFacturacion, listaFacturacion, obtenerFacturacionPorId, descargarFacturacion } from "../controllers/facturacion.controllers.js";
import validarFactura from "../middlewares/validarFactura.js";
import validarId from "../middlewares/validarIds.js";
import verificarJWT from "../middlewares/verificarJWT.js";
import multer from "multer";

const router = Router();
const upload = multer({dest:"uploads/"});

router.route("/").post([verificarJWT,upload.single("seleccionarArchivo"),validarFactura],crearFacturacion).get([verificarJWT],listaFacturacion);
router.route("/:id").get(validarId,obtenerFacturacionPorId).delete([verificarJWT,validarId],eliminarFacturacion).put([verificarJWT,validarId,upload.single("seleccionarArchivo"),validarFactura],editarFacturacion);
router.get("/:id/descargar", [verificarJWT, validarId], descargarFacturacion)


export default router;
