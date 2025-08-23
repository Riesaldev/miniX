
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import selectUserByEmailModel from '../../models/users/selectUserByEmailModel.js';
import generateError from '../../utils/generateErrorUtil.js';

const loginUserController = async ( req, res, next ) => {
  try
  {
    const { email, password } = req.body;

    if ( !email || !password )
    {
      generateError( 'Faltan campos por completar', 400 );
    }

    const user = await selectUserByEmailModel( email );

    const isPassValid = user && ( await bcrypt.compare( password, user.password ) );

    if ( !isPassValid || !user )
    {
      generateError( 'Credenciales incorrectas', 403 );
    }

    const tokenInfo = {
      id: user.id,
      email: user.email
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