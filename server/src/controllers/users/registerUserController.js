import insertUserModel from '../../models/users/insertUserModel.js';
import generateError from '../../utils/generateErrorUtil.js';

const registerUserController = async ( req, res, next ) => {
  try
  {
    let { username, email, password } = req.body;

    if ( typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' )
    {
      generateError( 'Formato de datos inválido', 400 );
    }

    username = username.trim();
    email = email.trim();

    if ( !username || !email || !password )
    {
      generateError( 'Faltan campos por completar', 400 );
    }

    if ( username.length < 3 )
    {
      generateError( 'El username debe tener al menos 3 caracteres', 400 );
    }

    if ( password.length < 6 )
    {
      generateError( 'La contraseña debe tener al menos 6 caracteres', 400 );
    }

    await insertUserModel( username, email, password );

    res.status( 201 ).send( {
      status: 'ok',
      message: 'Usuario registrado',
    } )
  } catch ( error )
  {
    next( error )
  }
};

export default registerUserController;