
import jwt from 'jsonwebtoken';
import generateError from '../utils/generateErrorUtil.js';

/**
 * Middleware de autenticación.
 * Espera recibir el token JWT en el header Authorization (sin el prefijo Bearer para simplificar).
 * IMPORTANTE: El login firma con process.env.JWT_SECRET, así que aquí verificamos con la misma.
 */
const authUser = async ( req, res, next ) => {
  try
  {
    const { authorization } = req.headers;

    if ( !authorization )
    {
      generateError( 'No se proporcionó un token', 401 );
    }

    const secret = process.env.JWT_SECRET || process.env.SECRET; // fallback por si aún existe la vieja var
    if ( !secret )
    {
      // Facilita depuración si olvidamos definir la variable en .env
      generateError( 'Falta la variable de entorno JWT_SECRET', 500 );
    }

    try
    {
      const tokenInfo = jwt.verify( authorization, secret );
      req.user = { id: tokenInfo.id };
      next();
    } catch ( err )
    {
      console.error( 'Error verificando token:', err.message );
      generateError( 'Token inválido o expirado', 403 );
    }
  } catch ( err )
  {
    next( err );
  }
};

export default authUser;
