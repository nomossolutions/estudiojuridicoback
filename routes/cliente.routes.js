import { Router } from "express";
import {
  crearCliente,
  editarCliente,
  eliminarCliente,
  obtenerClientePorId,
  obtenerClientes,
} from "../controllers/cliente.controllers.js";
import validacionCliente from "../middlewares/validarCliente.js";
import validarId from "../middlewares/validarIds.js"
import verficarJWT from "../middlewares/verificarJWT.js";

const router = Router();

router.route("/").post([verficarJWT,validacionCliente], crearCliente).get(obtenerClientes);
router.route("/:id").get(validarId, obtenerClientePorId).delete([verficarJWT,validarId], eliminarCliente).put([verficarJWT,validarId, validacionCliente],editarCliente);

export default router;
