import { Router } from "express";
import {crearFacturacion, editarFacturacion, eliminarFacturacion, listaFacturacion, obtenerFacturacionPorId, descargarFacturacion } from "../controllers/facturacion.controllers.js";
import validarFactura from "../middlewares/validarFactura.js";
import validarId from "../middlewares/validarIds.js";
import verficarJWT from "../middlewares/verificarJWT.js";
import multer from "multer";

const router = Router();
const upload = multer({dest:"uploads/"});

router.route("/").post([verficarJWT,upload.single("seleccionarArchivo"),validarFactura],crearFacturacion).get(listaFacturacion);
router.route("/:id").get(validarId,obtenerFacturacionPorId).delete([verficarJWT,validarId],eliminarFacturacion).put([verficarJWT,validarId,upload.single("seleccionarArchivo"),validarFactura],editarFacturacion);
router.get("/:id/descargar", [verficarJWT, validarId], descargarFacturacion)


export default router;
