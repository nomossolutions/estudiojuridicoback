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
import verificarJWT from "../middlewares/verificarJWT.js";

const router = Router();

router.route("/").post([verificarJWT,validacionCliente], crearCliente).get([verificarJWT], obtenerClientes);
router.route("/:id").get([verificarJWT,validarId], obtenerClientePorId).delete([verificarJWT,validarId], eliminarCliente).put([verificarJWT,validarId, validacionCliente],editarCliente);

export default router;
