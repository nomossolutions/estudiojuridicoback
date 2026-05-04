import { Router } from 'express';
import { obtenerUsuarios, crearUsuario, obtenerUsuarioPorId, eliminarUsuario, actualizarUsuario, login } from '../controllers/usuarios.controllers.js';
import validacionUsuario from '../middlewares/validarUsuario.js';
import validarIds from "../middlewares/validarIds.js"
import verificarJWT from '../middlewares/verificarJWT.js';

const router = Router();


router.route('/').get([verificarJWT], obtenerUsuarios).post([verificarJWT, validacionUsuario], crearUsuario);
router.route('/login').post(login)
router.route('/:id').get(validarIds, obtenerUsuarioPorId).delete([verificarJWT, validarIds], eliminarUsuario).put([verificarJWT,validarIds, validacionUsuario] ,actualizarUsuario);

export default router;
