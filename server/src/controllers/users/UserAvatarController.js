import selectUserByIdModel from '../../models/users/selectUserByIdModel.js';
import updateAvatarModel from '../../models/users/updateAvatarModel.js';

import saveImgUtil from '../../utils/saveImgUtil.js';
import removeImgUtil from '../../utils/removeImgUtil.js';

import generateError from '../../utils/generateErrorUtil.js';

const userAvatarController = async ( req, res, next ) => {
  try
  {
    const avatar = req.files?.avatar;

    if ( !avatar )
    {
      generateError( 'Faltan campos', 400 );
    }

    const user = await selectUserByIdModel( req.user.id );

    if ( user?.avatar )
    {
      await removeImgUtil( user.avatar );
    }

    const avatarName = await saveImgUtil( avatar, 100 );
    const result = await updateAvatarModel( req.user.id, avatarName );

    if ( process.env.NODE_ENV !== 'production' )
    {
      console.log( '[userAvatarController] update result:', result );
    }
    if ( !result || result.affectedRows === 0 )
    {
      generateError( 'No se pudo actualizar el avatar (usuario inexistente o sin cambios)', 500 );
    }

    res.send( {
      status: 'ok',
      message: 'Avatar actualizado',
      data: { avatar: avatarName },
    } );
  } catch ( err )
  {
    next( err );
  }
};

export default userAvatarController;
