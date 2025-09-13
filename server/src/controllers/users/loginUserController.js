
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import selectUserByEmailModel from '../../models/users/selectUserByEmailModel.js';
import selectUserByUsernameModel from '../../models/users/selectUserByUsernameModel.js';
import generateError from '../../utils/generateErrorUtil.js';

const loginUserController = async ( req, res, next ) => {
  try
  {
    let { email, password, username } = req.body;

    // Permitir login con email o username en un solo campo opcional
    // Si llega un campo 'email' úsalo; si llega 'username' úsalo; si llega 'identifier' (posible extensión futura) también.
    const identifier = email || username || req.body?.identifier;

    if ( !identifier || !password )
    {
      generateError( 'Faltan campos por completar', 400 );
    }
    let user;
    if ( identifier.includes( '@' ) )
    {
      user = await selectUserByEmailModel( identifier );
    } else
    {
      user = await selectUserByUsernameModel( identifier );
    }

    const isPassValid = user && ( await bcrypt.compare( password, user.password ) );

    if ( !isPassValid || !user )
    {
      generateError( 'Credenciales incorrectas', 403 );
    }

    const tokenInfo = {
      id: user.id,
      email: user.email,
      username: user.username
    };

    const token = jwt.sign( tokenInfo, process.env.JWT_SECRET, {
      expiresIn: '7d'
    } );

    res.send( {
      status: 'ok',
      data: {
        token
      }
    } );
  } catch ( err )
  {
    next( err );
  }
};

export default loginUserController;