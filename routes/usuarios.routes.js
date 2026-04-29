import { Router } from 'express';
import { obtenerUsuarios, crearUsuario, obtenerUsuarioPorId, eliminarUsuario, actualizarUsuario, login } from '../controllers/usuarios.controllers.js';
import validacionUsuario from '../middlewares/validarUsuario.js';
import validarIds from "../middlewares/validarIds.js"
import verficarJWT from '../middlewares/verificarJWT.js';

const router = Router();


router.route('/').get(obtenerUsuarios).post([verficarJWT,validacionUsuario], crearUsuario);
router.route('/:id').get(validarIds ,obtenerUsuarioPorId).delete([verficarJWT,validarIds] ,eliminarUsuario).put([verficarJWT,validarIds, validacionUsuario] ,actualizarUsuario);
router.route('/login').post(login)

export default router;
