/**
 * Rutas relacionadas con usuarios.
 * Qué: define endpoints para registro, login y gestión de perfil.
 * Cómo: usa un Router de Express para aislar el dominio usuario.
 * Por qué: facilita mantenimiento y versionado (/api/users en app.js).
 */
import express from 'express';
import authUser from '../middlewares/authUser.js';

// Import centralizado de controladores para mantener la cohesión del dominio usuario.
import {
  registerUserController,
  loginUserController,
  getPrivateUserProfileController,
  userAvatarController,
  updateBioController,
} from '../controllers/users/index.js';

const router = express.Router();

/**
 * POST /register
 * Qué: crea un nuevo usuario.
 * Cómo: valida campos y delega en insertUserModel.
 * Por qué: punto de entrada público para onboard.
 */
router.post( '/register', registerUserController );

/**
 * POST /login
 * Qué: autentica credenciales y devuelve JWT.
 * Cómo: busca por email/username y firma token.
 * Por qué: necesaria para establecer sesión cliente (localStorage/bearer token).
 */
router.post( '/login', loginUserController );

/**
 * GET /profile
 * Qué: devuelve perfil privado del usuario logado.
 * Cómo: requiere middleware authUser que añade req.user.id.
 * Por qué: mostrar datos privados (email, bio, avatar, etc.).
 */
router.get( '/profile', authUser, getPrivateUserProfileController );

/**
 * PUT /avatar
 * Qué: actualiza avatar del usuario.
 * Cómo: procesa multipart/form-data y guarda imagen redimensionada.
 * Por qué: personalización visual del perfil.
 */
router.put( '/avatar', authUser, userAvatarController );

/**
 * PUT /bio
 * Qué: actualiza la biografía del usuario.
 * Cómo: valida longitud y persiste en DB.
 * Por qué: permitir información pública adicional.
 */
router.put( '/bio', authUser, updateBioController );

export default router;